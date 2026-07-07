'use client';

import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonnelSectionCard from './PersonnelSectionCard';
import EducationDrawer from './EducationDrawer';

const formatDate = (value) => value ? new Intl.DateTimeFormat('tr-TR').format(new Date(`${value}T00:00:00`)) : 'Devam Ediyor';

export default function PersonnelEducationSection({ educations, loading, error, saving, onSave, onDelete }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const openDrawer = (education = null) => { setSelected(education); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };
    const save = async (values) => { if (await onSave(values, selected?.id)) closeDrawer(); };
    const confirmDelete = async () => { if (await onDelete(deleteTarget.id)) setDeleteTarget(null); };

    return (
        <>
            <PersonnelSectionCard title="EĞİTİM" icon={<SchoolOutlinedIcon color="primary" fontSize="small" />} action={<Button variant="contained" color="success" size="small" startIcon={<AddIcon />} onClick={() => openDrawer()}>Ekle</Button>}>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box> : error ? <Alert severity="error">{error}</Alert> : (
                    <TableContainer><Table size="small" sx={{ minWidth: 1050 }}>
                        <TableHead><TableRow><TableCell>Eğitim Türü</TableCell><TableCell>Üniversite/Okul</TableCell><TableCell>Bölüm</TableCell><TableCell>Başlangıç Tarihi</TableCell><TableCell>Mezuniyet Tarihi</TableCell><TableCell>Açıklama</TableCell><TableCell align="center">İşlemler</TableCell></TableRow></TableHead>
                        <TableBody>{educations.length === 0 ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>Eğitim bilgisi bulunamadı.</TableCell></TableRow> : educations.map((item) => (
                            <TableRow key={item.id} hover><TableCell>{item.educationType}</TableCell><TableCell>{item.schoolName}</TableCell><TableCell>{item.department}</TableCell><TableCell>{formatDate(item.startDate)}</TableCell><TableCell>{formatDate(item.graduationDate)}</TableCell><TableCell>{item.description || '—'}</TableCell><TableCell align="center"><Tooltip title="Düzenle"><IconButton size="small" onClick={() => openDrawer(item)}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Sil"><IconButton size="small" color="error" onClick={() => setDeleteTarget(item)}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip></TableCell></TableRow>
                        ))}</TableBody>
                    </Table></TableContainer>
                )}
            </PersonnelSectionCard>
            <EducationDrawer open={drawerOpen} education={selected} loading={saving} onClose={closeDrawer} onSave={save} />
            <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}><DialogTitle>Eğitim kaydı silinsin mi?</DialogTitle><DialogContent><DialogContentText>Bu işlem geri alınamaz.</DialogContentText></DialogContent><DialogActions><Button onClick={() => setDeleteTarget(null)}>İptal</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>Sil</Button></DialogActions></Dialog>
        </>
    );
}
