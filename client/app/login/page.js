'use client';
import api from '../api/axiosInstance';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        const usernameOrEmail = formData.email.trim();

        if (!usernameOrEmail || !formData.password) {
            toast.warning('Kullanıcı adı/e-posta ve şifre alanlarını doldurun.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post('/api/auth/login', {
                usernameOrEmail,
                password: formData.password
            });

            console.log('Giriş Başarılı! Backend Cevabı:', response.data);

            const rolePriority = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];
            const rawAuthorities = Array.isArray(response.data?.authorities)
                ? response.data.authorities
                : [];

            const grantedRoles = rawAuthorities
                .map((authority) => {
                    const value = typeof authority === 'string'
                        ? authority
                        : authority?.authority || authority?.name;

                    if (typeof value !== 'string') {
                        return null;
                    }

                    const normalizedValue = value.trim().toUpperCase();

                    return normalizedValue.startsWith('ROLE_')
                        ? normalizedValue.substring(5)
                        : normalizedValue;
                })
                .filter((role) => rolePriority.includes(role));

            const userRole = rolePriority.find((role) =>
                grantedRoles.includes(role)
            );

            if (!userRole) {
                throw new Error('Giriş yanıtında geçerli kullanıcı rolü bulunamadı.');
            }

            console.log('Tarayıcıya (localStorage) yazılan rol:', userRole);
            localStorage.setItem('user_role', userRole);

            router.push('/');
            toast.success('Giriş Başarılı! Hoş geldiniz. 🎉');

        } catch (error) {
            console.error('Giriş Hatası:', error.response?.data || error.message);
            localStorage.removeItem('user_role');
            const errorMessage = error.response?.status === 401
                ? 'Kullanıcı adı veya şifre hatalı! Lütfen bilgilerinizi kontrol edin. 🔑'
                : 'Giriş başarısız! Lütfen tekrar deneyin.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1c1d22',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    maxWidth: '1920px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Image
                    src="/background-.png"
                    alt="Arka Plan"
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        zIndex: 0
                    }}
                    priority
                />

                <Box
                    sx={{
                        position: 'absolute',
                        zIndex: 10,
                        left: { xs: '50%', md: '12.5%' },
                        transform: { xs: 'translateX(-50%)', md: 'none' },
                        width: '100%',
                        maxWidth: '415px',
                        px: { xs: 2, md: 0 }
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: '4px',
                            width: '100%',
                            backgroundColor: '#ffffff',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Box sx={{ width: '100%', maxWidth: 190, height: 'auto', mb: 3 }}>
                            <Image
                                src="/bilgem-logo.png"
                                alt="TÜBİTAK BİLGEM YTE"
                                width={500}
                                height={440}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                                priority
                            />
                        </Box>

                        <Typography
                            component="h1"
                            variant="h6"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                color: '#000000',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Personel Bilgi Sistemi
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Kullanıcı Adı/E-posta"
                                name="email"
                                autoFocus
                                value={formData.email}
                                onChange={handleChange}
                                slotProps={{
                                    inputLabel: { shrink: true }
                                }}
                                sx={{
                                    mb: 2.5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '4px',
                                        backgroundColor: '#ffffff',
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#E32619',
                                            borderWidth: '1px'
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#6B7280'
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
                                        WebkitTextFillColor: '#000000',
                                        caretColor: '#000000',
                                        transition: 'background-color 5000s ease-in-out 0s'
                                    }
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Şifre"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{
                                    mb: 2.5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '4px',
                                        backgroundColor: '#ffffff',
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#E32619',
                                            borderWidth: '1px'
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#6B7280'
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
                                        WebkitTextFillColor: '#000000',
                                        caretColor: '#000000',
                                        transition: 'background-color 5000s ease-in-out 0s'
                                    }
                                }}
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    mt: 1
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            sx={{
                                                padding: '4px',
                                                '&.Mui-checked': { color: '#E32619' }
                                            }}
                                        />
                                    }
                                    label="Beni Hatırla"
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            color: '#4B5563'
                                        }
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    component="a"
                                    href="#"
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#9CA3AF',
                                        textDecoration: 'none',
                                        '&:hover': { color: '#4B5563' }
                                    }}
                                >
                                    Şifremi Unuttum
                                </Typography>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={
                                    isSubmitting ||
                                    !formData.email.trim() ||
                                    !formData.password
                                }
                                sx={{
                                    mt: 4,
                                    py: 1.5,
                                    borderRadius: '4px',
                                    backgroundColor: '#E32619',
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    boxShadow: 'none',
                                    '&:hover': { backgroundColor: '#c91e13', boxShadow: 'none' }
                                }}
                            >
                                {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}