'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import api from '../api/axiosInstance';

export default function RoleGuard({ children, allowedRoles }) {
    const [hasAccess, setHasAccess] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

    useEffect(() => {
        const userRole = localStorage.getItem('user_role');

        if (!userRole) {
            setIsLoggedIn(false);
            setHasAccess(false);
        } else if (!allowedRoles.includes(userRole)) {
            setIsLoggedIn(true);
            setHasAccess(false);
        } else {
            setIsLoggedIn(true);
            setHasAccess(true);
        }
    }, [allowedRoles]);

    const handleLoginAction = async () => {
        if (!isLoggedIn) {
            window.location.replace('/login');
            return;
        }

        setIsSwitchingAccount(true);

        try {
            await api.post('/api/auth/logout');
            localStorage.removeItem('user_role');
            window.location.replace('/login');
        } catch (error) {
            console.error('Farklı hesaba geçiş sırasında logout başarısız oldu:', error);
            setIsSwitchingAccount(false);
        }
    };

    if (hasAccess === null) {
        return null;
    }

    if (!hasAccess) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '75vh',
                    textAlign: 'center',
                    gap: 3,
                    px: 3
                }}
            >
                <Typography variant="h4" color="error" fontWeight={700}>
                    {isLoggedIn ? 'Erişim Engellendi (403)' : 'Oturum Açmanız Gerekiyor'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                    {isLoggedIn
                        ? 'Bu sayfayı görüntülemek için gerekli yetki rolüne sahip değilsiniz. Lütfen doğru yetkilere sahip bir hesapla giriş yaptığınızdan emin olun.'
                        : 'Bu sayfaya erişebilmek için sisteme giriş yapmış olmanız gerekmektedir.'
                    }
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<LoginIcon />}
                    onClick={handleLoginAction}
                    disabled={isSwitchingAccount}
                    sx={{
                        backgroundColor: '#E32619',
                        fontWeight: 600,
                        px: 4,
                        py: 1.2,
                        '&:hover': {
                            backgroundColor: '#c91e13'
                        }
                    }}
                >
                    {isSwitchingAccount
                        ? 'Çıkış Yapılıyor...'
                        : isLoggedIn
                            ? 'Farklı Hesapla Giriş Yap'
                            : 'Giriş Yap'}
                </Button>
            </Box>
        );
    }

    return children;
}