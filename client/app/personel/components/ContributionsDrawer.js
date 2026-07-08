'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Divider, Drawer, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const emptyValues = { type: '', description: '', link: '', uploadDate: '', attachment: null };

export default function ContributionsDrawer({ open, contribution, loading, onClose, onSave }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: emptyValues });

    useEffect(() => {
        reset(contribution ? {
            type: contribution.type || '',
            description: contribution.description || '',
            link: contribution.link || '',
            uploadDate: contribution.uploadDate || '',
            attachment: null
        } : emptyValues);
    }, [contribution, open, reset]);

    return (
        <Drawer anchor="right" open={open} onClose={loading ? undefined : onClose}>
            <Box component="form" onSubmit={handleSubmit(onSave)} sx={{ width: { xs: '100vw', sm: 520 }, p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>{contribution ? 'Katkıyı Düzenle' : 'Katkı Ekle'}</Typography>
                    <IconButton onClick={onClose} disabled={loading} aria-label="Kapat"><CloseIcon /></IconButton>
                </Stack>
                <Divider sx={{ my: 2.5 }} />
                <Stack spacing={2}>
                    <TextField label="Etkinlik Türü" size="small" fullWidth error={Boolean(errors.type)} helperText={errors.type?.message} {...register('type', { required: 'Etkinlik türü zorunludur.' })} />
                    <TextField label="Açıklama" size="small" fullWidth multiline minRows={3} inputProps={{ maxLength: 1000 }} error={Boolean(errors.description)} helperText={errors.description?.message} {...register('description')} />
                    <TextField label="Link" size="small" fullWidth error={Boolean(errors.link)} helperText={errors.link?.message} {...register('link')} />
                    <Box>
                        <input type="file" {...register('attachment')} />
                    </Box>
                    <TextField label="Yüklenme Tarihi" type="date" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} error={Boolean(errors.uploadDate)} helperText={errors.uploadDate?.message} {...register('uploadDate')} />
                </Stack>
                <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
                    <Button onClick={onClose} disabled={loading}>İptal</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
