'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

function Unauthorized() {
    const router = useRouter();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
                textAlign: "center",
                gap: 2
            }}
        >
            <Typography variant="h4" color="error" fontWeight="bold">
                Bu sayfayı görme yetkiniz bulunmamaktadır.
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Bu alana erişim yetkiniz kısıtlanmıştır.
            </Typography>
            <Button variant="contained" onClick={() => router.push('/')}>
                Ana Sayfaya Dön
            </Button>
        </Box>
    );
}

export default function RoleGuard({ children, allowedRoles }) {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        setUserRole(role);
        setLoading(false);
    }, []);

    if (loading) return null;

    if (!allowedRoles.includes(userRole)) {
        return <Unauthorized />;
    }

    return <>{children}</>;
}