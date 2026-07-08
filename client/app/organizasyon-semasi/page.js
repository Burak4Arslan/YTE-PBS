'use client';
import RoleGuard from '../components/RoleGuard';
import { Box, Typography } from '@mui/material';

export default function OrganizasyonSemasiPage() {
    return (
        <RoleGuard allowedRoles={['EMPLOYEE', 'ADMIN']}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh'
                }}
            >
                <Typography variant="h5" color="text.primary" fontWeight={500}>
                    Organizasyon Şeması sayfası, herkes (admin ve personel) görebilir. (Şu an admin veya personelsin)
                </Typography>
            </Box>
        </RoleGuard>
    );
}