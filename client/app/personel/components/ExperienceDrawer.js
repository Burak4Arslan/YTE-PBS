'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Divider, Drawer, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const emptyValues = { company: '', position: '', employmentType: '', startDate: '', endDate: '', leavingReason: '', description: '' };

export default function ExperienceDrawer({ open, experience, loading, onClose, onSave }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyValues });

    useEffect(() => {
        reset(experience ? {
            company: experience.company || experience.institution || '',
            position: experience.position || '',
            employmentType: experience.employmentType || '',
            startDate: experience.startDate || '',
            endDate: experience.endDate || '',
            leavingReason: experience.leavingReason || '',
            description: experience.description || ''
        } : emptyValues);
    }, [experience, open, reset]);

    return (
        <Drawer anchor="right" open={open} onClose={loading ? undefined : onClose}>
            <Box component="form" onSubmit={handleSubmit(onSave)} sx={{ width: { xs: '100vw', sm: 520 }, p: 3 }}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={700}>{experience ? 'Deneyimi Düzenle' : 'Deneyim Ekle'}</Typography>
                    <IconButton onClick={onClose} disabled={loading} aria-label="Kapat"><CloseIcon /></IconButton>
                </Stack>
                <Divider sx={{ my: 2.5 }} />
                <Stack spacing={2}>
                    <TextField label="Çalıştığı Kurum Adı" size="small" fullWidth error={Boolean(errors.company)} helperText={errors.company?.message} {...register('company', { required: 'Kurum/Şirket zorunludur.' })} />
                    <TextField label="Çalıştığı Pozisyon" size="small" fullWidth error={Boolean(errors.position)} helperText={errors.position?.message} {...register('position', { required: 'Pozisyon zorunludur.' })} />
                    <TextField label="Çalışma Şekli" size="small" fullWidth error={Boolean(errors.employmentType)} helperText={errors.employmentType?.message} {...register('employmentType')} />
                    <TextField label="İşe Başlama Tarihi" type="date" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} error={Boolean(errors.startDate)} helperText={errors.startDate?.message} {...register('startDate', { required: 'İşe başlama tarihi zorunludur.' })} />
                    <TextField label="İşten Çıkış Tarihi" type="date" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} {...register('endDate')} />
                    <TextField label="İşten Ayrılış Nedeni" size="small" fullWidth error={Boolean(errors.leavingReason)} helperText={errors.leavingReason?.message} {...register('leavingReason')} />
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
