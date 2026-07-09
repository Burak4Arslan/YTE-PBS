"use client";
import RoleGuard from '../components/RoleGuard';

import React, { useState } from 'react';
import { 
  TextField, MenuItem, Button, Box, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import styles from './page.module.css';

export default function ReportsPage() {
  const [filterForm, setFilterForm] = useState({
    title: 'Hepsi',
    workType: 'Hepsi',
    projectWorkedOn: 'Hepsi',
    department: 'Hepsi',
    educationType: 'Hepsi',
    graduationDepartment: 'Hepsi',
    cadre: 'Hepsi',
    personnelType: 'Hepsi',
    duty: 'Hepsi',
    workStatus: 'Hepsi',
    team: 'Hepsi',
    contribution: 'Hepsi',
    hireDateStart: '',
    hireDateEnd: '',
    leaveDateStart: '',
    leaveDateEnd: ''
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterForm(prev => ({ ...prev, [name]: value }));
  };

  const cleanPayload = () => {
    const payload = { ...filterForm };
    Object.keys(payload).forEach(key => {
      if (payload[key] === 'Hepsi') {
        payload[key] = '';
      }
    });
    return payload;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/personnel/search', cleanPayload());
      setRows(response.data);
    } catch (error) {
      console.error("Arama hatası:", error);
      toast.error("Arama işlemi başarısız oldu. Lütfen yetkinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.post('/api/personnel/export', cleanPayload(), {
        responseType: 'blob' // Important for file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'personel_raporu.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export hatası:", error);
      toast.error("Excel indirme işlemi başarısız oldu.");
    }
  };

  const handleClear = () => {
    setFilterForm({
      title: 'Hepsi',
    workType: 'Hepsi',
    projectWorkedOn: 'Hepsi',
    department: 'Hepsi',
    educationType: 'Hepsi',
    graduationDepartment: 'Hepsi',
    cadre: 'Hepsi',
    personnelType: 'Hepsi',
    duty: 'Hepsi',
    workStatus: 'Hepsi',
    team: 'Hepsi',
    contribution: 'Hepsi',
      hireDateStart: '', hireDateEnd: '', leaveDateStart: '', leaveDateEnd: ''
    });
    setRows([]);
  };

  const selectSlotProps = {

    select: {

      MenuProps: {

        disableScrollLock: true,

      },

    },

  };

  const columns = [

    { field: 'firstName', headerName: 'Ad', flex: 1, minWidth: 100 },
    { field: 'lastName', headerName: 'Soyad', flex: 1, minWidth: 100 },
    { field: 'registrationNumber', headerName: 'Sicil No', flex: 0.8, minWidth: 90 },
    { field: 'cadre', headerName: 'Kadro', flex: 0.6, minWidth: 70 },
    { field: 'title', headerName: 'Unvan', flex: 1.2, minWidth: 120 },
    { field: 'department', headerName: 'Birim', flex: 1.5, minWidth: 140 },
    { field: 'projectWorkedOn', headerName: 'Proje', flex: 1, minWidth: 100 },
    { field: 'duty', headerName: 'Görev', flex: 1, minWidth: 110 },
    { field: 'personnelType', headerName: 'Personel Türü', flex: 1, minWidth: 110 },
    { field: 'workType', headerName: 'Çalışma Türü', flex: 1, minWidth: 110 },
    { field: 'workStatus', headerName: 'Durum', flex: 0.8, minWidth: 90 },
    { field: 'academicTitle', headerName: 'Akad. Unvan', flex: 1, minWidth: 100 },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className={styles.container}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        Admin - Raporlar
      </Typography>

      <Box className={styles.filtersGrid}>
        <TextField select size="small" label="Unvan" name="title" value={filterForm.title} onChange={handleInputChange} slotProps={selectSlotProps}>
          <MenuItem value="Hepsi">Hepsi</MenuItem>
          <MenuItem value="Araştırmacı">Araştırmacı</MenuItem>
          <MenuItem value="Uzman">Uzman</MenuItem>
        </TextField>

        <TextField select size="small" label="Çalışma Türü" name="workType" value={filterForm.workType} onChange={handleInputChange} slotProps={selectSlotProps}>
          <MenuItem value="Hepsi">Hepsi</MenuItem>
          <MenuItem value="Tam Zamanlı">Tam Zamanlı</MenuItem>
          <MenuItem value="Yarı Zamanlı">Yarı Zamanlı</MenuItem>
        </TextField>

        <TextField select size="small" label="Çalışılan Proje" name="projectWorkedOn" value={filterForm.projectWorkedOn} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="TENMAK">TENMAK</MenuItem>
        </TextField>

        <TextField select size="small" label="Birim" name="department" value={filterForm.department} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="Dijital Strateji">Dijital Strateji</MenuItem>
        </TextField>

        <TextField select size="small" label="Eğitim Türü" name="educationType" value={filterForm.educationType} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="Lisans">Lisans</MenuItem>
        </TextField>

        <Box className={styles.dateGroup}>
          <Typography variant="caption" sx={{minWidth: 100}}>Personel Sayısı (İşe Giriş):</Typography>
          <TextField type="date" size="small" name="hireDateStart" value={filterForm.hireDateStart} onChange={handleInputChange} sx={{ flex: 1 }}/>
          <span>-</span>
          <TextField type="date" size="small" name="hireDateEnd" value={filterForm.hireDateEnd} onChange={handleInputChange} sx={{ flex: 1 }}/>
        </Box>

        <TextField select size="small" label="Kadro" name="cadre" value={filterForm.cadre} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="AG">AG</MenuItem>
        </TextField>

        <TextField select size="small" label="Personel Türü" name="personnelType" value={filterForm.personnelType} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="MARTEK">MARTEK</MenuItem>
        </TextField>

        <TextField select size="small" label="Görev" name="duty" value={filterForm.duty} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="İş Analisti">İş Analisti</MenuItem>
        </TextField>

        <TextField select size="small" label="Çalışma Durumu" name="workStatus" value={filterForm.workStatus} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="Aktif">Aktif</MenuItem>
           <MenuItem value="Ayrıldı">Ayrıldı</MenuItem>
        </TextField>

        <TextField select size="small" label="Mezuniyet Bölümü" name="graduationDepartment" value={filterForm.graduationDepartment} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</MenuItem>
        </TextField>

        <Box className={styles.dateGroup}>
          <Typography variant="caption" sx={{minWidth: 100}}>Ayrılan Personel:</Typography>
          <TextField type="date" size="small" name="leaveDateStart" value={filterForm.leaveDateStart} onChange={handleInputChange} sx={{ flex: 1 }}/>
          <span>-</span>
          <TextField type="date" size="small" name="leaveDateEnd" value={filterForm.leaveDateEnd} onChange={handleInputChange} sx={{ flex: 1 }}/>
        </Box>

        <TextField select size="small" label="Takım" name="team" value={filterForm.team} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="Yazılım">Yazılım</MenuItem>
        </TextField>

        <TextField select size="small" label="Katkı" name="contribution" value={filterForm.contribution} onChange={handleInputChange} slotProps={selectSlotProps}>
           <MenuItem value="Hepsi">Hepsi</MenuItem>
           <MenuItem value="Makale">Makale</MenuItem>
        </TextField>

        <Box className={styles.buttonGroup}>
          <Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch} disabled={loading}>
            Sorgula
          </Button>
          <Button variant="outlined" color="success" startIcon={<FileDownloadIcon />} onClick={handleExport}>
            Excel Raporla
          </Button>
          <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={handleClear}>
            Temizle
          </Button>
        </Box>
      </Box>

      <Box className={styles.tableContainer}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          loading={loading}
          disableRowSelectionOnClick
          autoHeight
          slotProps={{
            basePagination: {
              material: {
                slotProps: {
                  select: {
                    MenuProps: {
                      disableScrollLock: true,
                    },
                  },
                },
              },
            },
          }}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid #ddd',
              fontWeight: 'bold',
            },
          }}
        />
      </Box>
          </div>
    </RoleGuard>
  );
}
