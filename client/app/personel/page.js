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
        title: '',
        duty: '',
        department: '',
        projectWorkedOn: '',
        contribution: '',
        team: ''
    });

    const [options, setOptions] = useState({
        title: [],
        duty: [],
        department: [],
        projectWorkedOn: [],
        contribution: [],
        team: []
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [titles, duties, departments, projects, teams, contributions] = await Promise.all([
                    axiosInstance.get('/api/personnel/options/titles'),
                    axiosInstance.get('/api/personnel/options/duties'),
                    axiosInstance.get('/api/personnel/options/departments'),
                    axiosInstance.get('/api/personnel/options/projects'),
                    axiosInstance.get('/api/personnel/options/teams'),
                    axiosInstance.get('/api/personnel/options/contributions')
                ]);
                setOptions({
                    title: titles.data || [],
                    duty: duties.data || [],
                    department: departments.data || [],
                    projectWorkedOn: projects.data || [],
                    team: teams.data || [],
                    contribution: contributions.data || []
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
            const payload = {
                ...filters
            };
            // Map the searchName to something the backend might support,
            // the DTO doesn't explicitly have 'name' but we can pass it if supported
            // If there's no name search in DTO, we might just filter on frontend
            // or backend might need an update later. We send it as is for now.
            const { data } = await axiosInstance.post('/api/personnel/search', payload);
            let results = data || [];

            // Client side name filter as fallback in case backend DTO doesn't support 'name'
            if (searchName.trim()) {
                const searchLower = searchName.toLowerCase();
                results = results.filter(p =>
                    (p.firstName + ' ' + p.lastName).toLowerCase().includes(searchLower)
                );
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

    const handleRowClick = async (row) => {
        try {
            const { data } = await axiosInstance.get('/api/directory');
            const entry = data.find(e => e.email === row.email);
            if (entry) {
                router.push(`/personel/${entry.id}`);
            } else {
                toast.error("Personelin rehber kaydı bulunamadı.");
            }
        } catch (error) {
            console.error("Rehber kaydı kontrol edilirken hata oluştu", error);
            toast.error("Personel detayına gidilirken bir hata oluştu.");
        }
    };
    const menuProps = {
        disableScrollLock: true,
    };
    const filterLabels = [
        { key: 'title', label: 'Unvan' },
        { key: 'duty', label: 'Görev' },
        { key: 'department', label: 'Birim' },
        { key: 'projectWorkedOn', label: 'Proje' },
        { key: 'contribution', label: 'Katkı' },
        { key: 'team', label: 'Takım' }
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
                            {options[key].map(opt => (
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
                        ) : personnelList.map((row) => (
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
                                        <Avatar src={row.photoUrl} sx={{ bgcolor: '#e0e0e0', color: '#000', border: '2px solid #000' }}>
                                            {!row.photoUrl && <PersonIcon />}
                                        </Avatar>
                                        <Typography fontWeight="bold">{row.firstName} {row.lastName}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', whiteSpace: 'pre-line', color: '#555' }}>
                                    {row.department || '-'}
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', color: '#555' }}>
                                    {row.title || '-'}
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, color: '#555' }}>
                                        <Typography variant="body2">{row.duty || '-'}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#000' }}>
                                        <EmailOutlinedIcon fontSize="small" />
                                        <Typography variant="body2">{row.email || '-'}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#000' }}>
                                        <PhoneOutlinedIcon fontSize="small" />
                                        <Typography variant="body2">{row.phoneNumber || '-'}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <IconButton size="small">
                                        <ArrowOutwardIcon fontSize="small" sx={{ color: '#555' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </RoleGuard>
    );
}