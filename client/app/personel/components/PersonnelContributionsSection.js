'use client';

import { useState } from 'react';
import { Alert, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonnelSectionCard from './PersonnelSectionCard';
import ContributionsDrawer from './ContributionsDrawer';

const formatDate = (value) => value ? new Intl.DateTimeFormat('tr-TR').format(new Date(`${value}T00:00:00`)) : '—';

export default function PersonnelContributionsSection({ contributions = [], loading, error, saving, onSave, onDelete }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const openDrawer = (contribution = null) => { setSelected(contribution); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };
    const save = async (values) => { if (onSave && await onSave(values, selected?.id)) closeDrawer(); };
    const confirmDelete = async () => { if (onDelete && await onDelete(deleteTarget.id)) setDeleteTarget(null); };

    return (
        <>
            <PersonnelSectionCard title="KATKILAR" icon={<LibraryBooksOutlinedIcon color="primary" fontSize="small" />} action={<Button variant="contained" color="success" size="small" startIcon={<AddIcon />} onClick={() => openDrawer()}>Ekle</Button>}>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box> : error ? <Alert severity="error">{error}</Alert> : (
                    <TableContainer><Table size="small" sx={{ minWidth: 760 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Etkinlik Türü</TableCell>
                                <TableCell>Açıklama</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Ek</TableCell>
                                <TableCell>Yüklenme Tarihi</TableCell>
                                <TableCell align="center">İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{contributions.length === 0 ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Katkı bilgisi bulunamadı.</TableCell></TableRow> : contributions.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.type || '—'}</TableCell>
                                <TableCell>{item.description || '—'}</TableCell>
                                <TableCell>{item.link ? <a href={item.link} target="_blank" rel="noreferrer">{item.link}</a> : '—'}</TableCell>
                                <TableCell>{item.attachmentName || item.attachment?.name || '—'}</TableCell>
                                <TableCell>{formatDate(item.uploadDate)}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Düzenle"><IconButton size="small" onClick={() => openDrawer(item)}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                                    <Tooltip title="Sil"><IconButton size="small" color="error" onClick={() => setDeleteTarget(item)}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table></TableContainer>
                )}
            </PersonnelSectionCard>
            <ContributionsDrawer open={drawerOpen} contribution={selected} loading={saving} onClose={closeDrawer} onSave={save} />
            <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
                <DialogTitle>Katkı kaydı silinsin mi?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Bu işlem geri alınamaz.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)}>İptal</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>Sil</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
