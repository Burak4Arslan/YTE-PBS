'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';

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

export default function PersonalCorporateInfo() {
    const { register, handleSubmit } = useForm({
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

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={3}>
                                Kişisel Bilgiler
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ad"
                                        {...register('firstName')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Soyad"
                                        {...register('lastName')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="T.C. Kimlik Numarası"
                                        {...register('nationalIdentityNumber')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Cinsiyet"
                                        {...register('gender')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Akademik Unvan"
                                        {...register('academicTitle')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="E-posta"
                                        type="email"
                                        {...register('email')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Doğum Tarihi"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        {...register('birthDate')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Kan Grubu"
                                        defaultValue=""
                                        {...register('bloodType')}
                                    >
                                        {bloodTypes.map((bloodType) => (
                                            <MenuItem key={bloodType} value={bloodType}>
                                                {bloodType}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Telefon"
                                        {...register('phoneNumber')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Araç Plakası"
                                        {...register('vehiclePlate')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Acil Durumda Ulaşılacak Kişi"
                                        {...register('emergencyContactName')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Acil Durumda Ulaşılacak Kişi Telefonu"
                                        {...register('emergencyContactPhone')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="İkametgâh Adresi"
                                        {...register('residentialAddress')}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={3}>
                                Kurumsal Bilgiler
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="İşe Giriş Tarihi"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        {...register('employmentStartDate')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Sicil No"
                                        {...register('registrationNumber')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Kadro"
                                        {...register('cadre')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Unvan"
                                        {...register('title')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Birim"
                                        {...register('unit')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Çalışılan Proje"
                                        {...register('currentProject')}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Görevi"
                                        {...register('duty')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Personel Türü"
                                        {...register('personnelType')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Çalışma Türü"
                                        {...register('workType')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Çalışma Durumu"
                                        {...register('workStatus')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Servis Kullanımı"
                                        defaultValue=""
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

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Dahili Numara"
                                        {...register('internalPhoneNumber')}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Oda Numarası"
                                        {...register('roomNumber')}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button type="submit" variant="contained">
                    Kaydet
                </Button>
            </Box>
        </Box>
    );
}