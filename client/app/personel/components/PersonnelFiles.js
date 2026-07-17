'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Drawer,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {
    Add,
    Close,
    DeleteOutlined,
    DownloadOutlined,
    FolderOutlined,
    UploadFileOutlined
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../api/axiosInstance';

const fileTypes = [
    'CV',
    'Sertifika',
    'Diploma',
    'Kimlik Belgesi',
    'Diğer'
];

const formatDate = (dateValue) => {
    if (!dateValue) {
        return '-';
    }

    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(dateValue));
};

export default function PersonnelFiles({
    email,
    department = '-',
    isOwnProfile = false
}) {
    const [files, setFiles] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [fileType, setFileType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [accessChecked, setAccessChecked] = useState(false);
    const [canManageFiles, setCanManageFiles] = useState(false);

    useEffect(() => {
        let isActive = true;

        const checkAccess = async () => {
            if (isOwnProfile) {
                if (isActive) {
                    setCanManageFiles(true);
                    setAccessChecked(true);
                }

                return;
            }

            try {
                const { data } = await api.get('/api/auth/me');
                const roles = Array.isArray(data?.roles)
                    ? data.roles
                    : [];

                if (isActive) {
                    setCanManageFiles(roles.includes('ADMIN'));
                }
            } catch (error) {
                if (isActive) {
                    setCanManageFiles(false);
                }
            } finally {
                if (isActive) {
                    setAccessChecked(true);
                }
            }
        };

        void checkAccess();

        return () => {
            isActive = false;
        };
    }, [isOwnProfile]);

    const fetchFiles = async () => {
        if (!email || !canManageFiles) {
            return;
        }

        try {
            const response = await api.get('/api/files', {
                params: {
                    email
                }
            });

            setFiles(response.data);
        } catch (error) {
            console.error('Dosyalar getirilemedi:', error);
        }
    };

    useEffect(() => {
        let isActive = true;

        const loadFiles = async () => {
            if (!accessChecked) {
                return;
            }

            if (!email || !canManageFiles) {
                if (isActive) {
                    setFiles([]);
                    setLoading(false);
                }

                return;
            }

            if (isActive) {
                setLoading(true);
            }

            try {
                const response = await api.get('/api/files', {
                    params: {
                        email
                    }
                });

                if (isActive) {
                    setFiles(response.data);
                }
            } catch (error) {
                console.error('Dosyalar getirilemedi:', error);
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        void loadFiles();

        return () => {
            isActive = false;
        };
    }, [email, accessChecked, canManageFiles]);

    const resetUploadForm = () => {
        setFileType('');
        setSelectedFile(null);
    };

    const handleCloseDrawer = () => {
        if (uploading) {
            return;
        }

        setDrawerOpen(false);
        resetUploadForm();
    };

    const handleUpload = async () => {
        if (!fileType) {
            toast.warning('Lütfen dosya türünü seçin.');
            return;
        }

        if (!selectedFile) {
            toast.warning('Lütfen yüklenecek dosyayı seçin.');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.warning('Dosya boyutu en fazla 10 MB olabilir.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploading(true);

            await api.post('/api/files', formData, {
                params: {
                    email,
                    fileType
                }
            });

            toast.success('Dosya başarıyla yüklendi.');

            setDrawerOpen(false);
            resetUploadForm();

            await fetchFiles();
        } catch (error) {
            console.error('Dosya yüklenemedi:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (personnelFile) => {
        try {
            const response = await api.get(
                `/api/files/${personnelFile.id}/download`,
                {
                    responseType: 'blob'
                }
            );

            const downloadUrl = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement('a');

            link.href = downloadUrl;
            link.download = personnelFile.fileName;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Dosya indirilemedi:', error);
        }
    };

    const handleDelete = async (fileId) => {
        const confirmed = window.confirm(
            'Bu dosyayı silmek istediğinize emin misiniz?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(fileId);

            await api.delete(`/api/files/${fileId}`);

            toast.success('Dosya başarıyla silindi.');

            await fetchFiles();
        } catch (error) {
            console.error('Dosya silinemedi:', error);
        } finally {
            setDeletingId(null);
        }
    };

    if (!accessChecked || !canManageFiles) {
        return null;
    }

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    mt: 2,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
                    borderBottom: '6px solid',
                    borderBottomColor: 'primary.main'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2.5,
                        py: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <FolderOutlined
                            sx={{
                                color: 'primary.main',
                                fontSize: 20
                            }}
                        />

                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                        >
                            DOSYALAR
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            boxShadow: 'none',
                            fontWeight: 700,
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        EKLE
                    </Button>
                </Box>

                <TableContainer>
                    <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        width: '22%'
                                    }}
                                >
                                    Dosya Türü
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        width: '30%'
                                    }}
                                >
                                    Dosya Adı
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        width: '20%'
                                    }}
                                >
                                    Bölüm
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        width: '18%'
                                    }}
                                >
                                    Yüklenme Tarihi
                                </TableCell>

                                <TableCell
                                    align="right"
                                    sx={{
                                        width: '10%'
                                    }}
                                />
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 5 }}
                                    >
                                        <CircularProgress size={28} />
                                    </TableCell>
                                </TableRow>
                            ) : files.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{
                                            py: 5,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        Henüz yüklenmiş dosya bulunmuyor.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                files.map((personnelFile) => (
                                    <TableRow
                                        key={personnelFile.id}
                                        hover
                                    >
                                        <TableCell>
                                            {personnelFile.fileType}
                                        </TableCell>

                                        <TableCell

                                            sx={{

                                                overflow: 'hidden',

                                                textOverflow: 'ellipsis',

                                                whiteSpace: 'nowrap'

                                            }}

                                        >

                                            {personnelFile.fileName}

                                        </TableCell>

                                        <TableCell>
                                            {department}
                                        </TableCell>

                                        <TableCell>
                                            {formatDate(
                                                personnelFile.createdAt
                                            )}
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton
                                                aria-label="Dosyayı indir"
                                                onClick={() =>
                                                    handleDownload(
                                                        personnelFile
                                                    )
                                                }
                                                sx={{
                                                    color: 'primary.main'
                                                }}
                                            >
                                                <DownloadOutlined />
                                            </IconButton>

                                            <IconButton
                                                aria-label="Dosyayı sil"
                                                disabled={
                                                    deletingId ===
                                                    personnelFile.id
                                                }
                                                onClick={() =>
                                                    handleDelete(
                                                        personnelFile.id
                                                    )
                                                }
                                                sx={{
                                                    color: 'error.main'
                                                }}
                                            >
                                                {deletingId ===
                                                personnelFile.id ? (
                                                    <CircularProgress
                                                        size={20}
                                                    />
                                                ) : (
                                                    <DeleteOutlined />
                                                )}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                disableScrollLock
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.35)'
                        }
                    },
                    paper: {
                        sx: {
                            width: {
                                xs: '100%',
                                sm: 420
                            }
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 3,
                            py: 2.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Dosya Ekle
                        </Typography>

                        <IconButton
                            onClick={handleCloseDrawer}
                            disabled={uploading}
                            aria-label="Paneli kapat"
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            p: 3,
                            flexGrow: 1
                        }}
                    >
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Dosya Türü"
                            value={fileType}
                            onChange={(event) =>
                                setFileType(event.target.value)
                            }
                            slotProps={{
                                select: {
                                    MenuProps: {
                                        disableScrollLock: true
                                    }
                                }
                            }}
                        >
                            <MenuItem value="">
                                Seçiniz
                            </MenuItem>

                            {fileTypes.map((type) => (
                                <MenuItem
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<UploadFileOutlined />}
                            sx={{
                                minHeight: 56,
                                justifyContent: 'flex-start',
                                textTransform: 'none'
                            }}
                        >
                            {selectedFile
                                ? selectedFile.name
                                : 'Dosya Seç'}

                            <input
                                hidden
                                type="file"
                                onChange={(event) =>
                                    setSelectedFile(
                                        event.target.files?.[0] ?? null
                                    )
                                }
                            />
                        </Button>

                        {selectedFile && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Dosya boyutu:{' '}
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}
                                {' MB'}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1.5,
                            px: 3,
                            py: 2.5,
                            borderTop: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleCloseDrawer}
                            disabled={uploading}
                        >
                            İPTAL
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={uploading}
                            startIcon={
                                uploading ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <UploadFileOutlined />
                                )
                            }
                            sx={{
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            {uploading ? 'YÜKLENİYOR' : 'YÜKLE'}
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
