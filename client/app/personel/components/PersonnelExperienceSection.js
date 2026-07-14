'use client';

import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonnelSectionCard from './PersonnelSectionCard';
import ExperienceDrawer from './ExperienceDrawer';

const formatDate = (value) => value ? new Intl.DateTimeFormat('tr-TR').format(new Date(`${value}T00:00:00`)) : 'Devam Ediyor';

export default function PersonnelExperienceSection({ experiences = [], loading, error, saving, onSave, onDelete }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const openDrawer = (experience = null) => { setSelected(experience); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };
    const save = async (values) => { if (onSave && await onSave(values, selected?.id)) closeDrawer(); };
    const confirmDelete = async () => { if (onDelete && await onDelete(deleteTarget.id)) setDeleteTarget(null); };

    return (
        <>
            <PersonnelSectionCard title="DENEYİM" icon={<BusinessCenterOutlinedIcon color="primary" fontSize="small" />} action={<Button variant="contained" color="success" size="small" startIcon={<AddIcon />} onClick={() => openDrawer()}>Ekle</Button>}>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box> : error ? <Alert severity="error">{error}</Alert> : (
                    <TableContainer><Table size="small" sx={{ minWidth: 1050 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Çalıştığı Kurum Adı</TableCell>
                                <TableCell>Çalıştığı Pozisyon</TableCell>
                                <TableCell>Çalışma Şekli</TableCell>
                                <TableCell>İşe Başlama Tarihi</TableCell>
                                <TableCell>İşten Çıkış Tarihi</TableCell>
                                <TableCell>İşten Ayrılış Nedeni</TableCell>
                                <TableCell align="center">İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{experiences.length === 0 ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>İş deneyimi bulunamadı.</TableCell></TableRow> : experiences.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.company || item.institution || '—'}</TableCell>
                                <TableCell>{item.position || '—'}</TableCell>
                                <TableCell>{item.employmentType || item.workType || '—'}</TableCell>
                                <TableCell>{formatDate(item.startDate)}</TableCell>
                                <TableCell>{formatDate(item.endDate)}</TableCell>
                                <TableCell>{item.leavingReason || '—'}</TableCell>
                                <TableCell align="center"><Tooltip title="Düzenle"><IconButton size="small" onClick={() => openDrawer(item)}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Sil"><IconButton size="small" color="error" onClick={() => setDeleteTarget(item)}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip></TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table></TableContainer>
                )}
            </PersonnelSectionCard>
            <ExperienceDrawer open={drawerOpen} experience={selected} loading={saving} onClose={closeDrawer} onSave={save} />
            <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}><DialogTitle>Deneyim kaydı silinsin mi?</DialogTitle><DialogContent><DialogContentText>Bu işlem geri alınamaz.</DialogContentText></DialogContent><DialogActions><Button onClick={() => setDeleteTarget(null)}>İptal</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>Sil</Button></DialogActions></Dialog>
        </>
    );
}
