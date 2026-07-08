'use client';

import { useState } from 'react';
import {
    Box,
    Button,
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
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

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
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

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

    if (selectedType.editable === false) {
        const descriptions = {
            PROJECT_FIELD:
                'Çalışılan projeler proje bilgileri üzerinden yönetilir.'
        };

        return (
            <Paper
                variant="outlined"
                sx={{
                    minHeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 5
                }}
            >
                <Box sx={{ textAlign: 'center', maxWidth: 520 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {selectedType.displayName}
                    </Typography>
                    <Typography color="text.secondary">
                        {descriptions[selectedType.code]}
                    </Typography>
                </Box>
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
                    Toplu Ekle
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
                                onDragOver={(event) => {
                                    event.preventDefault();

                                    if (draggedIndex !== null && draggedIndex !== index) {
                                        setDragOverIndex(index);
                                    }
                                }}
                                onDrop={(event) => {
                                    event.preventDefault();

                                    if (
                                        draggedIndex !== null &&
                                        draggedIndex !== index
                                    ) {
                                        onMove(draggedIndex, index);
                                    }

                                    setDraggedIndex(null);
                                    setDragOverIndex(null);
                                }}
                                sx={{
                                    width: '100%',
                                    minHeight: 72,
                                    boxSizing: 'border-box',
                                    display: 'grid',
                                    gridTemplateColumns: '44px minmax(0, 1fr) 88px',
                                    alignItems: 'center',
                                    columnGap: 1,
                                    p: 1,
                                    border: '1px solid',
                                    borderColor:
                                        dragOverIndex === index
                                            ? 'primary.main'
                                            : item.active
                                                ? 'divider'
                                                : '#E0E0E0',
                                    borderRadius: 1,
                                    backgroundColor:
                                        draggedIndex === index
                                            ? 'action.hover'
                                            : item.active
                                                ? '#FFFFFF'
                                                : '#F7F7F7',
                                    opacity:
                                        draggedIndex === index
                                            ? 0.55
                                            : item.active
                                                ? 1
                                                : 0.72,
                                    transition:
                                        'border-color 120ms ease, background-color 120ms ease, opacity 120ms ease'
                                }}
                            >
                                <Tooltip title="Sıralamak için sürükleyin">
                                    <Box
                                        draggable={!saving && !isEditing}
                                        onDragStart={(event) => {
                                            event.dataTransfer.effectAllowed = 'move';
                                            event.dataTransfer.setData(
                                                'text/plain',
                                                String(item.id)
                                            );
                                            setDraggedIndex(index);
                                        }}
                                        onDragEnd={() => {
                                            setDraggedIndex(null);
                                            setDragOverIndex(null);
                                        }}
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor:
                                                saving || isEditing
                                                    ? 'not-allowed'
                                                    : 'grab',
                                            color: 'text.secondary',
                                            userSelect: 'none',
                                            '&:active': {
                                                cursor: 'grabbing'
                                            }
                                        }}
                                    >
                                        <DragIndicatorIcon />
                                    </Box>
                                </Tooltip>

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
                                        sx={{ minWidth: 0 }}
                                        slotProps={{
                                            htmlInput: {
                                                maxLength: 200
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        sx={{
                                            minWidth: 0,
                                            fontSize: '0.95rem',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                )}

                                <Box
                                    sx={{
                                        width: 88,
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center'
                                    }}
                                >
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

                                            <Tooltip title="Sil">
                                                <span>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => onDeactivate(item)}
                                                        disabled={saving || !item.active}
                                                    >
                                                        <RemoveCircleOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Paper>
    );
}
