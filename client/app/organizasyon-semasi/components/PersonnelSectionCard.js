
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import PersonnelNode from './PersonnelNode';
import OrganizasyonFilterSidebar from './OrganizasyonFilterSidebar';
import {
    buildPersonnelHierarchyTree,
    fetchDirectoryIdByFullName,
    fetchPersonnelHierarchy
} from '../services/organizasyonSemasiService';

const STEM_WIDTH = 28;

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
    const matched = isMatch(node);

    const handleClick = () => {
        if (isClickable) router.push(`/rehber?personelId=${node.directoryEntryId}`);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
                {showDepartmentLabel && (
                    <Typography
                        variant="caption"
                        color="primary.main"
                        fontWeight={700}
                        sx={{
                            position: 'absolute',
                            bottom: '100%',
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            mb: 0.5,
                            opacity: matched ? 1 : 0.35,
                            transition: 'opacity 0.15s ease'
                        }}
                    >
                        {node.department}
                    </Typography>
                )}
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
            </Box>
            {hasChildren && (
                <>
                    <Box sx={{ width: STEM_WIDTH, height: '2px', bgcolor: 'divider', flexShrink: 0 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {node.children.map((child, index) => (
                            <Box key={child.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', py: 1.5 }}>
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
                                            top: index === 0 ? '50%' : 0,
                                            bottom: index === node.children.length - 1 ? '50%' : 0,
                                            width: '2px',
                                            bgcolor: 'divider'
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            width: STEM_WIDTH,
                                            height: '2px',
                                            bgcolor: 'divider'
                                        }
                                    }}
                                />
                                <HierarchyBranch node={child} parentDepartment={node.department} isMatch={isMatch} />
                            </Box>
                        ))}
                    </Box>
                </>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'auto', p: 2, flex: 1 }}>
                {roots.map((root) => (
                    <HierarchyBranch key={root.id} node={root} isMatch={isMatch} />
                ))}
            </Box>
        </Box>
    );
}