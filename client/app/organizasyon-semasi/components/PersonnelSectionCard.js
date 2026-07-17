'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, CircularProgress, Typography, IconButton, Tooltip, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonnelNode from './PersonnelNode';
import OrganizasyonFilterSidebar from './OrganizasyonFilterSidebar';
import {
    buildPersonnelHierarchyTree,
    fetchDirectoryIdByFullName,
    fetchPersonnelHierarchy
} from '../services/organizasyonSemasiService';

const STEM_WIDTH = 48;

function distinctValues(list, key) {
    return Array.from(new Set(list.map((item) => item[key]).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'tr')
    );
}

function HierarchyBranch({ node, parentDepartment, isMatch }) {
    const router = useRouter();
    const hasChildren = node.children.length > 0;
    const showDepartmentLabel = Boolean(node.department) && node.department !== parentDepartment;
    const isClickable = Boolean(node.directoryEntryId);
    
    const [isExpanded, setIsExpanded] = useState(true);
    const matched = isMatch(node);

    const handleClick = () => {
        if (isClickable) router.push(`/rehber?personelId=${node.directoryEntryId}`);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
                {showDepartmentLabel && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            mb: 1.5,
                            px: 2,
                            py: 0.5,
                            borderRadius: 4,
                            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                            zIndex: 1,
                            opacity: matched ? 1 : 0.35,
                            transition: 'opacity 0.15s ease'
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#fff',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            {node.department}
                        </Typography>
                    </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        onClick={handleClick}
                        sx={{
                            cursor: isClickable ? 'pointer' : 'default',
                            opacity: matched ? 1 : 0.35,
                            transition: 'opacity 0.15s ease',
                            '&:hover': isClickable ? { opacity: matched ? 0.8 : 0.5 } : undefined
                        }}
                    >
                        <PersonnelNode
                            personnelName={node.personnelName}
                            personnelSurname={node.personnelSurname}
                            personnelJobTitle={node.personnelJobTitle}
                            avatarUrl={node.avatarUrl}
                        />
                    </Box>
                    {hasChildren && (
                        <Box sx={{ ml: 1, zIndex: 2 }}>
                            <Tooltip title={isExpanded ? "Daralt" : "Genişlet"} placement="top">
                                <IconButton 
                                    onClick={handleToggle}
                                    size="small"
                                    sx={{ 
                                        bgcolor: 'background.paper', 
                                        boxShadow: 1,
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                >
                                    {isExpanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
            </Box>
            {hasChildren && (
                <Collapse in={isExpanded} orientation="horizontal" timeout={400}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box sx={{ width: STEM_WIDTH, height: '3px', bgcolor: 'primary.light', flexShrink: 0, opacity: 0.6 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {node.children.map((child, index) => {
                            const isFirst = index === 0;
                            const isLast = index === node.children.length - 1;
                            const isOnlyChild = node.children.length === 1;

                            return (
                                <Box key={child.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', py: 2 }}>
                                    <Box
                                        sx={{
                                            width: STEM_WIDTH,
                                            alignSelf: 'stretch',
                                            position: 'relative',
                                            flexShrink: 0,
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: isFirst ? '50%' : 0,
                                                bottom: isLast ? '50%' : 0,
                                                width: '3px',
                                                bgcolor: 'primary.light',
                                                opacity: 0.6,
                                                borderTopLeftRadius: isFirst && !isOnlyChild ? 8 : 0,
                                                borderBottomLeftRadius: isLast && !isOnlyChild ? 8 : 0,
                                            },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                left: isFirst || isLast ? '3px' : 0,
                                                top: '50%',
                                                width: isFirst || isLast ? `calc(${STEM_WIDTH}px - 3px)` : STEM_WIDTH,
                                                height: '3px',
                                                bgcolor: 'primary.light',
                                                opacity: 0.6,
                                                transform: 'translateY(-50%)'
                                            }
                                        }}
                                    />
                                    <HierarchyBranch node={child} parentDepartment={node.department} isMatch={isMatch} />
                                </Box>
                            );
                        })}
                        </Box>
                    </Box>
                </Collapse>
            )}
        </Box>
    );
}

export default function PersonnelSectionCard() {
    const [flatList, setFlatList] = useState([]);
    const [roots, setRoots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        let active = true;
        Promise.all([fetchPersonnelHierarchy(), fetchDirectoryIdByFullName()])
            .then(([personnelList, directoryIdByFullName]) => {
                if (!active) return;
                const enriched = personnelList.map((person) => {
                    const fullName = [person.personnelName, person.personnelSurname]
                        .filter(Boolean)
                        .join(' ')
                        .trim()
                        .toLowerCase();
                    return { ...person, directoryEntryId: directoryIdByFullName.get(fullName) ?? null };
                });
                setFlatList(enriched);
                setRoots(buildPersonnelHierarchyTree(enriched));
            })
            .catch(() => {
                if (active) setError('Organizasyon şeması yüklenirken bir hata oluştu.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const departments = useMemo(() => distinctValues(flatList, 'department'), [flatList]);
    const projects = useMemo(() => distinctValues(flatList, 'projectWorkedOn'), [flatList]);
    const teams = useMemo(() => distinctValues(flatList, 'team'), [flatList]);

    const isMatch = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();
        return (node) => {
            if (selectedDepartment && node.department !== selectedDepartment) return false;
            if (selectedProject && node.projectWorkedOn !== selectedProject) return false;
            if (selectedTeam && node.team !== selectedTeam) return false;
            if (normalizedSearch) {
                const fullName = [node.personnelName, node.personnelSurname].filter(Boolean).join(' ').toLowerCase();
                if (!fullName.includes(normalizedSearch)) return false;
            }
            return true;
        };
    }, [searchText, selectedDepartment, selectedProject, selectedTeam]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <OrganizasyonFilterSidebar
                searchText={searchText}
                onSearchChange={setSearchText}
                departments={departments}
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                projects={projects}
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
                teams={teams}
                selectedTeam={selectedTeam}
                onSelectTeam={setSelectedTeam}
            />
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 6, 
                overflowX: 'auto', 
                overflowY: 'hidden',
                p: 4,
                pt: 6,
                backgroundColor: 'background.default',
                borderRadius: 4,
                minHeight: '600px',
                flex: 1 
            }}>
                {roots.map((root) => (
                    <HierarchyBranch key={root.id} node={root} isMatch={isMatch} />
                ))}
            </Box>
        </Box>
    );
}