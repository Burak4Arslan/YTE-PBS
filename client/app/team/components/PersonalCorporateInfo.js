'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField as MuiTextField,
    Typography
} from '@mui/material';

const TextField = (props) => (
    <MuiTextField 
        {...props} 
        slotProps={{
            ...props.slotProps,
            inputLabel: {
                shrink: true,
                ...props.slotProps?.inputLabel
            }
        }} 
    />
);
import {
    BadgeOutlined,
    PersonOutlined
} from '@mui/icons-material';
import api from '../../api/axiosInstance';

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

function splitFullName(fullName = '') {
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return { firstName: '', lastName: '' };
    }

    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
    }

    return {
        firstName: parts.slice(0, -1).join(' '),
        lastName: parts.at(-1)
    };
}

export default function PersonalCorporateInfo({ email = '', readOnly = false }) {
    const [saving, setSaving] = useState(false);
    const { register, handleSubmit, reset, control } = useForm({
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
            roomNumber: '',
            profileImageUrl: ''
        }
    });
    const lastName = useWatch({ control, name: 'lastName' }) || '';
    const profileImageUrl = useWatch({ control, name: 'profileImageUrl' }) || '';

    useEffect(() => {
        let ignore = false;

        const loadProfile = async () => {
            try {
                if (readOnly && !email) {
                    reset();
                    return;
                }

                if (readOnly) {
                    const [{ data: directory }, personnelResponse] = await Promise.all([
                        api.get('/api/directory'),
                        api.get('/api/personnel', { params: { email } })
                    ]);

                    if (ignore) {
                        return;
                    }

                    const directoryEntry = directory.find(
                        (entry) => entry.email?.toLowerCase() === email.toLowerCase()
                    );
                    const personnel = personnelResponse.data || {};
                    const nameParts = splitFullName(directoryEntry?.fullName);

                    reset({
                        firstName: personnel.firstName || nameParts.firstName,
                        lastName: personnel.lastName || nameParts.lastName,
                        nationalIdentityNumber: personnel.tcIdentityNumber || '',
                        gender: personnel.gender || '',
                        academicTitle: personnel.academicTitle || '',
                        email: personnel.email || directoryEntry?.email || email,
                        birthDate: personnel.birthDate || '',
                        bloodType: personnel.bloodType || '',
                        phoneNumber: personnel.phoneNumber || directoryEntry?.phoneNumber || '',
                        vehiclePlate: personnel.licensePlate || '',
                        emergencyContactName: personnel.emergencyContactPerson || '',
                        emergencyContactPhone: personnel.emergencyContactPhone || '',
                        residentialAddress: personnel.residentialAddress || '',
                        employmentStartDate: personnel.hireDate || '',
                        registrationNumber: personnel.registrationNumber || '',
                        cadre: personnel.cadre || '',
                        title: personnel.title || directoryEntry?.title || '',
                        unit: personnel.department || directoryEntry?.unit || '',
                        currentProject: personnel.projectWorkedOn || directoryEntry?.project || '',
                        duty: personnel.duty || directoryEntry?.duty || '',
                        personnelType: personnel.personnelType || '',
                        workType: personnel.workType || '',
                        workStatus: personnel.workStatus || '',
                        usesShuttleService: personnel.shuttleUsage || '',
                        internalPhoneNumber: personnel.extensionNumber || '',
                        roomNumber: personnel.roomNumber || '',
                        profileImageUrl: personnel.photoUrl || ''
                    });
                    return;
                }

                const { data } = await api.get('/api/personel/hakkımda');

                if (ignore) {
                    return;
                }

                reset({
                    ...data,
                    birthDate: data.birthDate || '',
                    employmentStartDate: data.employmentStartDate || '',
                    usesShuttleService: data.usesShuttleService == null ? '' : String(data.usesShuttleService)
                });
            } catch (error) {
                console.error('Profil bilgileri yüklenemedi:', error);
                toast.error('Profil bilgileri yüklenemedi.');
            }
        };

        loadProfile();

        return () => {
            ignore = true;
        };
    }, [email, readOnly, reset]);

    const onSubmit = async (data) => {
        if (readOnly) {
            return;
        }

        setSaving(true);
        try {
            await api.put('/api/personel/hakkımda', {
                birthDate: data.birthDate || null,
                bloodType: data.bloodType || null,
                phoneNumber: data.phoneNumber || null,
                vehiclePlate: data.vehiclePlate || null,
                emergencyContactName: data.emergencyContactName || null,
                emergencyContactPhone: data.emergencyContactPhone || null,
                residentialAddress: data.residentialAddress || null,
                internalPhoneNumber: data.internalPhoneNumber || null,
                roomNumber: data.roomNumber || null
            });
            toast.success('Profil bilgileri güncellendi.');
        } catch (error) {
            console.error('Profil bilgileri güncellenemedi:', error);
            toast.error('Profil bilgileri güncellenemedi.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
        >
            <fieldset
                disabled={readOnly || saving}
                style={{ border: 0, margin: 0, minWidth: 0, padding: 0 }}
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
                                    src={profileImageUrl || undefined}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: '#bdbdbd'
                                    }}
                                >
                                    {!profileImageUrl && <PersonOutlined />}
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
                                        sx={fieldSx}
                                        slotProps={{
                                            inputLabel: { shrink: true }
                                        }}
                                        {...register('birthDate')}
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
            </fieldset>

            {!readOnly && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button type="submit" variant="contained" disabled={saving}>
                        Kaydet
                    </Button>
                </Box>
            )}

        </Box>
    );
}
