'use client';
import RoleGuard from '../components/RoleGuard';
import { Box, Typography } from '@mui/material';

export default function YetkilendirmePage() {
    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh'
                }}
            >
                <Typography variant="h5" color="text.primary" fontWeight={500}>
                    Yetkilendirme sayfası, sadece admin görebilir. (Şu an adminsin)
                </Typography>
            </Box>
        </RoleGuard>
    );
}