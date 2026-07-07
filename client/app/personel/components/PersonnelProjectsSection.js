'use client';

import { Alert, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlined';
import PersonnelSectionCard from './PersonnelSectionCard';

const formatDate = (value) => value ? new Intl.DateTimeFormat('tr-TR').format(new Date(`${value}T00:00:00`)) : 'Devam Ediyor';

export default function PersonnelProjectsSection({ projects, loading, error }) {
    return (
        <PersonnelSectionCard title="DAHİL OLUNAN PROJELER" icon={<WorkOutlineIcon color="primary" fontSize="small" />}>
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box> : error ? <Alert severity="error">{error}</Alert> : (
                <TableContainer><Table size="small" sx={{ minWidth: 760 }}>
                    <TableHead><TableRow><TableCell>Proje Adı</TableCell><TableCell>Takım</TableCell><TableCell>Görevi</TableCell><TableCell>Başlangıç Tarihi</TableCell><TableCell>Bitiş Tarihi</TableCell></TableRow></TableHead>
                    <TableBody>{projects.length === 0 ? <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Dahil olunan proje bulunamadı.</TableCell></TableRow> : projects.map((item) => (
                        <TableRow key={item.id} hover><TableCell>{item.project?.projectName || '—'}</TableCell><TableCell>{item.team || '—'}</TableCell><TableCell>{item.duty || '—'}</TableCell><TableCell>{formatDate(item.beginDate)}</TableCell><TableCell>{formatDate(item.endDate)}</TableCell></TableRow>
                    ))}</TableBody>
                </Table></TableContainer>
            )}
        </PersonnelSectionCard>
    );
}
