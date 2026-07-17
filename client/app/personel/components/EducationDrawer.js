'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Divider, Drawer, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCustomEnumOptionMap } from '../../services/customEnumOptions';

const emptyValues = { educationType: '', schoolName: '', department: '', startDate: '', graduationDate: '', description: '' };

export default function EducationDrawer({ open, education, loading, onClose, onSave }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyValues });
    const [options, setOptions] = useState({ educationTypes: [], schools: [], departments: [] });

    useEffect(() => {
        if (!open) return;

        getCustomEnumOptionMap(['EDUCATION_TYPE', 'SCHOOL', 'EDUCATION_DEPARTMENT'])
            .then((loadedOptions) => setOptions({
                educationTypes: loadedOptions.EDUCATION_TYPE,
                schools: loadedOptions.SCHOOL,
                departments: loadedOptions.EDUCATION_DEPARTMENT
            }))
            .catch((error) => console.error('Eğitim seçenekleri yüklenemedi:', error));
    }, [open]);

    useEffect(() => {
        reset(education ? {
            educationType: education.educationType || '', schoolName: education.schoolName || '',
            department: education.department || '', startDate: education.startDate || '',
            graduationDate: education.graduationDate || '', description: education.description || ''
        } : emptyValues);
    }, [education, open, reset]);

    return (
        <Drawer anchor="right" open={open} onClose={loading ? undefined : onClose} disableScrollLock>
            <Box component="form" onSubmit={handleSubmit(onSave)} sx={{ width: { xs: '100vw', sm: 440 }, p: 3 }}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={700}>{education ? 'Eğitimi Düzenle' : 'Eğitim Ekle'}</Typography>
                    <IconButton onClick={onClose} disabled={loading} aria-label="Kapat"><CloseIcon /></IconButton>
                </Stack>
                <Divider sx={{ my: 2.5 }} />
                <Stack spacing={2}>
                    <TextField select label="Eğitim Türü" size="small" fullWidth defaultValue="" error={Boolean(errors.educationType)} helperText={errors.educationType?.message} {...register('educationType', { required: 'Eğitim türü zorunludur.' })}>
                        {options.educationTypes.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                    </TextField>
                    <TextField select label="Üniversite/Okul" size="small" fullWidth defaultValue="" error={Boolean(errors.schoolName)} helperText={errors.schoolName?.message} {...register('schoolName', { required: 'Üniversite/Okul zorunludur.' })}>
                        {options.schools.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                    </TextField>
                    <TextField select label="Bölüm" size="small" fullWidth defaultValue="" error={Boolean(errors.department)} helperText={errors.department?.message} {...register('department', { required: 'Bölüm zorunludur.' })}>
                        {options.departments.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                    </TextField>
                    <TextField label="Başlangıç Tarihi" type="date" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} error={Boolean(errors.startDate)} helperText={errors.startDate?.message} {...register('startDate', { required: 'Başlangıç tarihi zorunludur.' })} />
                    <TextField label="Mezuniyet Tarihi" type="date" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} {...register('graduationDate')} />
                    <TextField label="Açıklama" size="small" fullWidth multiline minRows={3} slotProps={{ htmlInput: { maxLength: 500 } }} {...register('description')} />
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={onClose} disabled={loading}>İptal</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
