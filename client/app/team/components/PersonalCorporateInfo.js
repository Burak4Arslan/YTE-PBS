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

function getLocalDateInputValue(date) {
    const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;

    return new Date(date.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10);
}

function normalizeOptionalText(value) {
    const normalizedValue = String(value ?? '').trim();

    return normalizedValue || null;
}

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
    const maxBirthDate = getLocalDateInputValue(new Date());

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isDirty }
    } = useForm({
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
            const { data: updatedProfile } = await api.put(
                '/api/personel/hakkımda',
                {
                    birthDate: data.birthDate || null,
                    bloodType: normalizeOptionalText(data.bloodType),
                    phoneNumber: normalizeOptionalText(data.phoneNumber),
                    vehiclePlate: normalizeOptionalText(data.vehiclePlate),
                    emergencyContactName:
                        normalizeOptionalText(data.emergencyContactName),
                    emergencyContactPhone:
                        normalizeOptionalText(data.emergencyContactPhone),
                    residentialAddress:
                        normalizeOptionalText(data.residentialAddress),
                    internalPhoneNumber:
                        normalizeOptionalText(data.internalPhoneNumber),
                    roomNumber: normalizeOptionalText(data.roomNumber)
                }
            );

            reset({
                ...updatedProfile,
                birthDate: updatedProfile.birthDate || '',
                employmentStartDate:
                    updatedProfile.employmentStartDate || '',
                usesShuttleService:
                    updatedProfile.usesShuttleService == null
                        ? ''
                        : String(updatedProfile.usesShuttleService)
            });

            toast.success('Profil bilgileri güncellendi.');
        } catch (error) {
            console.warn(
                'Profil güncelleme isteği başarısız:',
                error.response?.status || error.message
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: '100%' }}
        >
            {!readOnly && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: 2
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving || !isDirty}
                    >
                        {saving
                            ? 'Kaydediliyor...'
                            : 'Değişiklikleri Kaydet'}
                    </Button>
                </Box>
            )}

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

                                {!readOnly && (
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
                                )}

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

                                {!readOnly && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Doğum Tarihi"
                                            type="date"
                                            disabled={readOnly}
                                            error={Boolean(errors.birthDate)}
                                            helperText={
                                                errors.birthDate?.message
                                            }
                                            sx={fieldSx}
                                            slotProps={{
                                                inputLabel: { shrink: true },
                                                htmlInput: {
                                                    min: '1900-01-01',
                                                    max: maxBirthDate
                                                }
                                            }}
                                            {...register('birthDate', {
                                                validate: (value) => {
                                                    if (!value) {
                                                        return true;
                                                    }

                                                    if (
                                                        !/^\d{4}-\d{2}-\d{2}$/.test(
                                                            value
                                                        )
                                                    ) {
                                                        return 'Yıl 4 haneli olmalıdır.';
                                                    }

                                                    if (value < '1900-01-01') {
                                                        return 'Doğum tarihi 1900 yılından önce olamaz.';
                                                    }

                                                    if (value > maxBirthDate) {
                                                        return 'Doğum tarihi gelecekte olamaz.';
                                                    }

                                                    return true;
                                                }
                                            })}
                                        />
                                    </Grid>
                                )}

                                {!readOnly && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Kan Grubu"
                                            disabled={readOnly}
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
                                )}

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Telefon"
                                        disabled={readOnly}
                                        sx={fieldSx}
                                        {...register('phoneNumber')}
                                    />
                                </Grid>

                                {!readOnly && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Araç Plakası"
                                            disabled={readOnly}
                                            sx={fieldSx}
                                            {...register('vehiclePlate')}
                                        />
                                    </Grid>
                                )}

                                {!readOnly && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Acil Durumda Ulaşılacak Kişi"
                                            disabled={readOnly}
                                            sx={fieldSx}
                                            {...register('emergencyContactName')}
                                        />
                                    </Grid>
                                )}

                                {!readOnly && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Acil Durumda Ulaşılacak Kişi Tel"
                                            disabled={readOnly}
                                            sx={fieldSx}
                                            {...register('emergencyContactPhone')}
                                        />
                                    </Grid>
                                )}

                                {!readOnly && (
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="İkametgâh Adresi"
                                            disabled={readOnly}
                                            sx={fieldSx}
                                            {...register('residentialAddress')}
                                        />
                                    </Grid>
                                )}
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
                                        disabled={readOnly}
                                        sx={fieldSx}
                                        {...register('internalPhoneNumber')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Oda Numarası"
                                        disabled={readOnly}
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

        </Box>
    );
}
