'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import PersonalCorporateInfo from '../../team/components/PersonalCorporateInfo';

export default function PersonnelDetailPage() {
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
            </Container>
        </Box>
    );
}