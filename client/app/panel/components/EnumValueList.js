'use client';

import { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function EnumValueList({
    selectedType,
    values,
    loading,
    saving,
    onCreate,
    onUpdate,
    onDeactivate,
    onMove,
    onOpenBulkAdd
}) {
    const [newValue, setNewValue] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState('');

    const handleCreate = async () => {
        const normalizedValue = newValue.trim();

        if (!normalizedValue) {
            return;
        }

        const created = await onCreate(normalizedValue);

        if (created !== false) {
            setNewValue('');
        }
    };

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditingValue(item.value);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingValue('');
    };

    const handleUpdate = async (item) => {
        const normalizedValue = editingValue.trim();

        if (!normalizedValue || normalizedValue === item.value) {
            cancelEditing();
            return;
        }

        const updated = await onUpdate(item, normalizedValue);

        if (updated !== false) {
            cancelEditing();
        }
    };

    if (!selectedType) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    minHeight: 420,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4
                }}
            >
                <Typography color="text.secondary">
                    Değerlerini yönetmek istediğiniz alanı seçin.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            variant="outlined"
            sx={{
                minHeight: 420,
                p: { xs: 2, md: 3 }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography variant="overline" color="text.secondary">
                        Alan Adı
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {selectedType.displayName}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onOpenBulkAdd}
                    disabled={saving}
                >
                    Hızlı Ekle
                </Button>
            </Box>

            <Typography
                variant="subtitle2"
                sx={{
                    fontWeight: 700,
                    mb: 1.5
                }}
            >
                Yanıt Seçenekleri
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 2
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Yeni seçenek girin"
                    value={newValue}
                    onChange={(event) => setNewValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleCreate();
                        }
                    }}
                    disabled={saving}
                    slotProps={{
                        htmlInput: {
                            maxLength: 200
                        }
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    disabled={saving || !newValue.trim()}
                    sx={{ minWidth: 110 }}
                >
                    Ekle
                </Button>
            </Box>

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 8
                    }}
                >
                    <CircularProgress size={32} />
                </Box>
            ) : values.length === 0 ? (
                <Box
                    sx={{
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        py: 6,
                        px: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography color="text.secondary">
                        Bu alan için henüz seçenek eklenmemiş.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {values.map((item, index) => {
                        const isEditing = editingId === item.id;

                        return (
                            <Box
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1,
                                    border: '1px solid',
                                    borderColor: item.active ? 'divider' : '#E0E0E0',
                                    borderRadius: 1,
                                    backgroundColor: item.active ? '#FFFFFF' : '#F7F7F7',
                                    opacity: item.active ? 1 : 0.72
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Tooltip title="Yukarı taşı">
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={() => onMove(index, -1)}
                                                disabled={saving || index === 0}
                                            >
                                                <KeyboardArrowUpIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Aşağı taşı">
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={() => onMove(index, 1)}
                                                disabled={saving || index === values.length - 1}
                                            >
                                                <KeyboardArrowDownIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>

                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={editingValue}
                                        onChange={(event) => setEditingValue(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleUpdate(item);
                                            }

                                            if (event.key === 'Escape') {
                                                cancelEditing();
                                            }
                                        }}
                                        autoFocus
                                        disabled={saving}
                                        slotProps={{
                                            htmlInput: {
                                                maxLength: 200
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        sx={{
                                            flex: 1,
                                            fontSize: '0.95rem',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                )}

                                {!item.active && (
                                    <Chip
                                        label="Pasif"
                                        size="small"
                                        variant="outlined"
                                    />
                                )}

                                {isEditing ? (
                                    <>
                                        <Tooltip title="Kaydet">
                                            <span>
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleUpdate(item)}
                                                    disabled={saving || !editingValue.trim()}
                                                >
                                                    <SaveOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Vazgeç">
                                            <IconButton
                                                onClick={cancelEditing}
                                                disabled={saving}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip title="Düzenle">
                                            <span>
                                                <IconButton
                                                    onClick={() => startEditing(item)}
                                                    disabled={saving || !item.active}
                                                >
                                                    <EditOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Pasife al">
                                            <span>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => onDeactivate(item)}
                                                    disabled={saving || !item.active}
                                                >
                                                    <RemoveCircleOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Paper>
    );
}
