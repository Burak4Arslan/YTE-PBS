'use client';

import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';

export default function BulkAddDialog({
    open,
    fieldName,
    saving,
    onClose,
    onSubmit
}) {
    const [text, setText] = useState('');

    const handleClose = () => {
        if (saving) {
            return;
        }

        setText('');
        onClose();
    };

    const handleSubmit = async () => {
        const values = text
            .split('\n')
            .map((value) => value.trim())
            .filter(Boolean);

        if (values.length === 0) {
            return;
        }

        const created = await onSubmit(values);

        if (created !== false) {
            setText('');
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableScrollLock
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Toplu Ekle</DialogTitle>

            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Excel&apos;deki bir sütunu kopyalayıp buraya yapıştırabilirsiniz. Her satır ayrı bir yanıt seçeneği olarak eklenecektir.
                </DialogContentText>

                <TextField
                    autoFocus
                    fullWidth
                    multiline
                    minRows={8}
                    placeholder="Seçenekleri buraya yazın veya yapıştırın"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    disabled={saving}
                    slotProps={{
                        htmlInput: {
                            maxLength: 5000
                        }
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={saving}
                >
                    Vazgeç
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={saving || !text.trim()}
                >
                    Ekle
                </Button>
            </DialogActions>
        </Dialog>
    );
}
