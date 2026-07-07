'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Container } from '@mui/material';
import PersonalCorporateInfo from '../../team/components/PersonalCorporateInfo';
import PersonnelFiles from '../components/PersonnelFiles';

export default function PersonnelDetailPage() {
    const params = useParams();
    const userId = params.id;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                py: 2
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    px: {
                        xs: 2,
                        md: 3
                    }
                }}
            >
                <PersonalCorporateInfo />
                <PersonnelFiles userId={userId} />
            </Container>
        </Box>
    );
}