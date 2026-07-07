'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import {
    BadgeOutlined,
    PersonOutlined
} from '@mui/icons-material';

const bloodTypes = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    '0+',
    '0-'
];

const fieldSx = {
    '& .MuiInputBase-root': {
        backgroundColor: '#fff'
    }
};

const cardSx = {
    height: '100%',
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
    borderBottom: '6px solid',
    borderBottomColor: 'primary.main',
    overflow: 'hidden'
};

export default function PersonalCorporateInfo() {
    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            nationalIdentityNumber: '',
            gender: '',
            academicTitle: '',
            email: '',
            birthDate: '',
            bloodType: '',
            phoneNumber: '',
            vehiclePlate: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            residentialAddress: '',

            employmentStartDate: '',
            registrationNumber: '',
            cadre: '',
            title: '',
            unit: '',
            currentProject: '',
            duty: '',
            personnelType: '',
            workType: '',
            workStatus: '',
            usesShuttleService: '',
            internalPhoneNumber: '',
            roomNumber: ''
        }
    });
    const lastName = watch('lastName');

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
        >
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={cardSx}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 3
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <BadgeOutlined
                                        sx={{
                                            color: 'primary.main',
                                            fontSize: 20
                                        }}
                                    />

                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={700}
                                    >
                                        KİŞİSEL
                                    </Typography>
                                </Box>

                                <Avatar
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: '#bdbdbd'
                                    }}
                                >
                                    <PersonOutlined />
                                </Avatar>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Ad"
                                        disabled
                                        sx={fieldSx}
                                        {...register('firstName')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        disabled
                                        label="Soyad"
                                        sx={fieldSx}
                                        {...register('lastName')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="T.C. Kimlik Numarası"
                                        disabled
                                        sx={fieldSx}
                                        {...register('nationalIdentityNumber')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Cinsiyet"
                                        disabled
                                        sx={fieldSx}
                                        {...register('gender')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Akademik Unvan"
                                        disabled
                                        sx={fieldSx}
                                        {...register('academicTitle')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="E-posta"
                                        type="email"
                                        disabled
                                        sx={fieldSx}
                                        {...register('email')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Doğum Tarihi"
                                        type="date"
                                        slotProps={{
                                            inputLabel: { shrink: true }
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        select
                                        label="Kan Grubu"
                                        defaultValue=""
                                        sx={fieldSx}
                                        slotProps={{

                                            select: {

                                                MenuProps: {

                                                    disableScrollLock: true

                                                }

                                            }

                                        }}
                                        {...register('bloodType')}
                                    >
                                        <MenuItem value="">
                                            Seçiniz
                                        </MenuItem>

                                        {bloodTypes.map((bloodType) => (
                                            <MenuItem
                                                key={bloodType}
                                                value={bloodType}
                                            >
                                                {bloodType}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Telefon"
                                        sx={fieldSx}
                                        {...register('phoneNumber')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Araç Plakası"
                                        sx={fieldSx}
                                        {...register('vehiclePlate')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Acil Durumda Ulaşılacak Kişi"
                                        sx={fieldSx}
                                        {...register('emergencyContactName')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Acil Durumda Ulaşılacak Kişi Tel"
                                        sx={fieldSx}
                                        {...register('emergencyContactPhone')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="İkametgâh Adresi"
                                        sx={fieldSx}
                                        {...register('residentialAddress')}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={cardSx}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 3
                                }}
                            >
                                <BadgeOutlined
                                    sx={{
                                        color: 'primary.main',
                                        fontSize: 20
                                    }}
                                />

                                <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                >
                                    KURUMSAL
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="İşe Giriş Tarihi"
                                        type="date"
                                        disabled
                                        sx={fieldSx}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        {...register('employmentStartDate')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Sicil No"
                                        disabled
                                        sx={fieldSx}
                                        {...register('registrationNumber')}
                                    />
                                </Grid>


                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Kadro"
                                        disabled
                                        sx={fieldSx}
                                        {...register('cadre')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Unvan"
                                        disabled
                                        sx={fieldSx}
                                        {...register('title')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Birim"
                                        disabled
                                        sx={fieldSx}
                                        {...register('unit')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Çalışılan Proje"
                                        disabled
                                        sx={fieldSx}
                                        {...register('currentProject')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Görevi"
                                        disabled
                                        sx={fieldSx}
                                        {...register('duty')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Soyad"
                                        value={lastName}
                                        disabled
                                        sx={fieldSx}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Personel Türü"
                                        disabled
                                        sx={fieldSx}
                                        {...register('personnelType')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Çalışma Türü"
                                        disabled
                                        sx={fieldSx}
                                        {...register('workType')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Çalışma Durumu"
                                        disabled
                                        sx={fieldSx}
                                        {...register('workStatus')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        select
                                        label="Servis Kullanımı"
                                        disabled
                                        defaultValue=""
                                        sx={fieldSx}
                                        slotProps={{

                                            select: {

                                                MenuProps: {

                                                    disableScrollLock: true

                                                }

                                            }

                                        }}
                                        {...register('usesShuttleService')}
                                    >
                                        <MenuItem value="">
                                            Seçiniz
                                        </MenuItem>
                                        <MenuItem value="true">
                                            Evet
                                        </MenuItem>
                                        <MenuItem value="false">
                                            Hayır
                                        </MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Dahili Numara"
                                        sx={fieldSx}
                                        {...register('internalPhoneNumber')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Oda Numarası"
                                        sx={fieldSx}
                                        {...register('roomNumber')}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
<<<<<<< HEAD

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button type="submit" variant="contained">
                    Kaydet
                </Button>
            </Box>
=======
>>>>>>> 2e5480a5c4bf399e4b3cd3eac98a2a7b5ba7d76f
        </Box>
    );
}