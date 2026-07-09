
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import PersonnelNode from './PersonnelNode';
import {
    buildPersonnelHierarchyTree,
    fetchDirectoryIdByFullName,
    fetchPersonnelHierarchy
} from '../services/organizasyonSemasiService';

const STEM_WIDTH = 28;

function HierarchyBranch({ node, parentDepartment }) {
    const router = useRouter();
    const hasChildren = node.children.length > 0;
    const showDepartmentLabel = Boolean(node.department) && node.department !== parentDepartment;
    const isClickable = Boolean(node.directoryEntryId);

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
                            mb: 0.5
                        }}
                    >
                        {node.department}
                    </Typography>
                )}
                <Box
                    onClick={handleClick}
                    sx={{
                        cursor: isClickable ? 'pointer' : 'default',
                        transition: 'opacity 0.15s ease',
                        '&:hover': isClickable ? { opacity: 0.8 } : undefined
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
                                <HierarchyBranch node={child} parentDepartment={node.department} />
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
}

export default function PersonnelSectionCard() {
    const [roots, setRoots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'auto', p: 2 }}>
            {roots.map((root) => (
                <HierarchyBranch key={root.id} node={root} />
            ))}
        </Box>
    );
}