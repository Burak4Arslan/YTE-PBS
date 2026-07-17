'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Paper,
    Avatar,
    Typography,
    MenuItem,
    IconButton,
    Select,
    FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PersonIcon from '@mui/icons-material/Person';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import RoleGuard from '../components/RoleGuard';

export default function PersonelPage() {
    const router = useRouter();
    const [personnelList, setPersonnelList] = useState([]);
    const [searchName, setSearchName] = useState('');

    const [filters, setFilters] = useState({
        unvan: '',
        gorev: '',
        birim: '',
        proje: ''
    });

    const [options, setOptions] = useState({
        unvan: [],
        gorev: [],
        birim: [],
        proje: []
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [titles, duties, units, projects] = await Promise.all([
                    axiosInstance.get('/api/personnel/options/titles').catch(() => ({ data: [] })),
                    axiosInstance.get('/api/personnel/options/duties').catch(() => ({ data: [] })),
                    axiosInstance.get('/api/personnel/options/departments').catch(() => ({ data: [] })),
                    axiosInstance.get('/api/personnel/options/projects').catch(() => ({ data: [] }))
                ]);

                setOptions({
                    unvan: titles.data || [],
                    gorev: duties.data || [],
                    birim: units.data || [],
                    proje: projects.data || []
                });
            } catch (error) {
                console.error("Filtre seçenekleri alınamadı", error);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        fetchPersonnel();
    }, []);

    const fetchPersonnel = async () => {
        try {
            // Fetching exactly what Rehber fetches
            const { data } = await axiosInstance.get('/api/directory');
            let results = data || [];

            if (searchName.trim()) {
                const searchLower = searchName.toLowerCase();
                results = results.filter(p => {
                    const fullName = p.adSoyad || "";
                    return fullName.toLowerCase().includes(searchLower);
                });
            }

            if (filters.unvan) {
                results = results.filter(p => p.unvan === filters.unvan);
            }
            if (filters.gorev) {
                results = results.filter(p => p.gorevler === filters.gorev);
            }
            if (filters.birim) {
                results = results.filter(p => p.birim === filters.birim);
            }
            if (filters.proje) {
                results = results.filter(p => p.proje === filters.proje);
            }

            setPersonnelList(results);
        } catch (error) {
            console.error("Personeller getirilemedi", error);
            toast.error("Personel listesi yüklenirken bir hata oluştu.");
        }
    };

    const handleFilterChange = (field) => (event) => {
        setFilters({ ...filters, [field]: event.target.value });
    };

    const handleRowClick = (row) => {
        if (row.id) {
            router.push(`/personel/${row.id}`);
        } else {
            toast.error("Personel detayına gidilirken bir hata oluştu.");
        }
    };

    const menuProps = {
        disableScrollLock: true,
    };

    const filterLabels = [
        { key: 'unvan', label: 'Unvan' },
        { key: 'gorev', label: 'Görev' },
        { key: 'birim', label: 'Birim' },
        { key: 'proje', label: 'Proje' }
    ];

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <Box sx={{ maxWidth: '1400px', margin: '0 auto', mt: 4, px: 3 }}>

                {/* Filters Row */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="İsim Soyisim"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '20px', width: '220px', bgcolor: '#fff', height: '40px' }
                            }
                        }}
                    />

                    {filterLabels.map(({ key, label }) => (
                        <FormControl key={key} size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={filters[key]}
                                onChange={handleFilterChange(key)}
                                displayEmpty
                                MenuProps={menuProps}
                                sx={{ borderRadius: '20px', bgcolor: '#fff', height: '40px', color: filters[key] ? 'inherit' : '#aaa' }}
                            >
                                <MenuItem value="" disabled sx={{ display: 'none' }}>
                                    {label}
                                </MenuItem>
                                <MenuItem value="">Tümü</MenuItem>
                                {options[key]?.map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ))}

                    <Button
                        variant="contained"
                        onClick={fetchPersonnel}
                        sx={{
                            bgcolor: '#000',
                            color: '#fff',
                            '&:hover': { bgcolor: '#333' },
                            borderRadius: '20px',
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            ml: 'auto'
                        }}
                    >
                        SORGULA
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => router.push('/personel/ekle')}
                        sx={{
                            bgcolor: '#000',
                            color: '#fff',
                            '&:hover': { bgcolor: '#333' },
                            borderRadius: '20px',
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        PERSONEL EKLE
                    </Button>
                </Box>

                {/* Table */}
                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 1000, borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderBottom: '2px solid #000', fontWeight: 'bold', fontSize: '15px', pb: 2, borderRight: '1px solid #e0e0e0' }}>Ad Soyad</TableCell>
                                <TableCell align="center" sx={{ borderBottom: '2px solid #000', fontWeight: 'bold', fontSize: '15px', pb: 2, borderRight: '1px solid #e0e0e0' }}>Birim</TableCell>
                                <TableCell align="center" sx={{ borderBottom: '2px solid #000', fontWeight: 'bold', fontSize: '15px', pb: 2, borderRight: '1px solid #e0e0e0' }}>Unvan</TableCell>
                                <TableCell align="center" sx={{ borderBottom: '2px solid #000', fontWeight: 'bold', fontSize: '15px', pb: 2, borderRight: '1px solid #e0e0e0' }}>Görev</TableCell>
                                <TableCell align="center" sx={{ borderBottom: '2px solid #000', fontWeight: 'bold', fontSize: '15px', pb: 2, borderRight: '1px solid #e0e0e0' }}>E-Posta</TableCell>
                                <TableCell align="center" sx={{ borderBottom: '2px solid #000', fontWeight: 'bold', fontSize: '15px', pb: 2 }}>Telefon</TableCell>
                                <TableCell sx={{ borderBottom: '2px solid #000', width: '40px' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {personnelList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#777' }}>
                                        Kayıt bulunamadı.
                                    </TableCell>
                                </TableRow>
                            ) : personnelList.map((row) => {
                                // Helper function to safely extract non-empty strings
                                const getVal = (...keys) => {
                                    for (let key of keys) {
                                        if (row[key] && String(row[key]).trim() !== "" && String(row[key]).trim() !== "-") {
                                            return String(row[key]).trim();
                                        }
                                    }
                                    return null;
                                };

                                // 1. Resolve NAME safely
                                let displayName = getVal('adSoyad', 'adsoyad', 'name');
                                if (!displayName) {
                                    const first = getVal('firstName', 'ad');
                                    const last = getVal('lastName', 'soyad');
                                    displayName = first || last ? `${first || ''} ${last || ''}`.trim() : "-";
                                }

                                // 2. Resolve BIRIM safely
                                const displayBirim = getVal('birim', 'department', 'unit', 'departman') || "-";

                                // 3. Resolve UNVAN safely
                                const displayUnvan = getVal('unvan', 'title') || "-";

                                // 4. Resolve GÖREV safely
                                const displayGorev = getVal('gorevler', 'gorev', 'duty') || "-";

                                // 5. Resolve EMAIL safely
                                const displayEmail = getVal('ePosta', 'email', 'mail') || "-";

                                // 6. Resolve PHONE safely
                                const displayPhone = getVal('telefon', 'phoneNumber', 'phone') || "-";

                                const displayAvatar = getVal('avatarUrl', 'photoUrl', 'profileImageUrl');

                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        onClick={() => handleRowClick(row)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:last-child td, &:last-child th': { borderBottom: '2px solid #000' }
                                        }}
                                    >
                                        <TableCell sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={displayAvatar || undefined} sx={{ bgcolor: '#e0e0e0', color: '#000', border: '2px solid #000' }}>
                                                    {!displayAvatar && <PersonIcon />}
                                                </Avatar>
                                                <Typography fontWeight="bold">{displayName}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', whiteSpace: 'pre-line', color: '#555' }}>
                                            {displayBirim}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', color: '#555' }}>
                                            {displayUnvan}
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, color: '#555' }}>
                                                <Typography variant="body2">{displayGorev}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#000' }}>
                                                <EmailOutlinedIcon fontSize="small" />
                                                <Typography variant="body2">{displayEmail}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#000' }}>
                                                <PhoneOutlinedIcon fontSize="small" />
                                                <Typography variant="body2">{displayPhone}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                            <IconButton size="small">
                                                <ArrowOutwardIcon fontSize="small" sx={{ color: '#555' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </RoleGuard>
    );
}