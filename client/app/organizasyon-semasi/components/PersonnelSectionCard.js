
'use client';

import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import PersonnelNode from './PersonnelNode';
import { buildPersonnelHierarchyTree, fetchPersonnelHierarchy } from '../services/organizasyonSemasiService';

const STEM_WIDTH = 28;

function HierarchyBranch({ node }) {
    const hasChildren = node.children.length > 0;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <PersonnelNode
                personnelName={node.personnelName}
                personnelSurname={node.personnelSurname}
                personnelJobTitle={node.personnelJobTitle}
                avatarUrl={node.avatarUrl}
            />
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
                                <HierarchyBranch node={child} />
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
        fetchPersonnelHierarchy()
            .then((personnelList) => {
                if (active) setRoots(buildPersonnelHierarchyTree(personnelList));
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