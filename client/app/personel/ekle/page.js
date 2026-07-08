'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import {
    Box, Button, Typography, TextField, MenuItem, Select,
    FormControl, CircularProgress, InputLabel
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Tekrar eden form satırı bileşeni — label solda, input sağda
function FormRow({ label, children, required }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Typography
                sx={{
                    minWidth: 180,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: '#333',
                    flexShrink: 0
                }}
            >
                {label}{required && '*'}
            </Typography>
            <Box sx={{ flex: 1 }}>
                {children}
            </Box>
        </Box>
    );
}

// Kırmızı yatay çizgi ayracı
function RedDivider() {
    return <Box sx={{ borderBottom: '2px solid #E32619', my: 2 }} />;
}

// Ortak input stili
const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '4px',
        backgroundColor: '#fff',
        '& fieldset': { borderColor: '#ccc' },
        '&:hover fieldset': { borderColor: '#999' },
        '&.Mui-focused fieldset': { borderColor: '#333', borderWidth: '1px' },
    },
    '& .MuiOutlinedInput-input': {
        padding: '8px 12px',
        fontSize: '0.85rem',
    },
};

const selectSx = {
    borderRadius: '4px',
    backgroundColor: '#fff',
    fontSize: '0.85rem',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#333', borderWidth: '1px' },
    '& .MuiSelect-select': { padding: '8px 12px' },
};

export default function PersonnelAddPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', tcIdentityNumber: '', email: '', gender: '', academicTitle: '',
        hireDate: '', registrationNumber: '', cadre: '', title: '', personnelType: '', workType: '', workStatus: '',
        department: '', duty: '', team: '', projectWorkedOn: '', mentor: '', shuttleUsage: '',
        residentialAddress: '', phoneNumber: '', birthDate: '', extensionNumber: '', roomNumber: '',
        licensePlate: '', bloodType: '', emergencyContactPerson: '', emergencyContactPhone: '', photoUrl: ''
    });

    // BACKEND AUTH GUARD
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('/api/auth/me');
                const roles = response.data.roles || [];
                if (!roles.includes('ADMIN')) {
                    toast.error("Bu sayfaya erişim yetkiniz bulunmamaktadır! 🔒");
                    router.push('/');
                } else {
                    setAuthorized(true);
                }
            } catch (error) {
                console.error("Yetki doğrulama hatası:", error);
            }
        };
        checkAuth();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name) => (e) => {
        setFormData(prev => ({ ...prev, [name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/api/personnel', formData);
            toast.success("Personel sisteme başarıyla eklenmiştir! 🎉");
            router.push('/rehber');
        } catch (error) {
            console.error("Personel ekleme hatası:", error);
            if (error.response?.status === 403) {
                toast.error("Bu işlem için ADMIN yetkisi gereklidir! 🚫");
            } else if (error.response?.status !== 401) {
                toast.error("Personel eklenirken bir hata oluştu.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!authorized) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress sx={{ color: '#E32619', mb: 2 }} />
                    <Typography sx={{ color: '#666' }}>Yetki kontrol ediliyor...</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 3 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                {/* İki Panel Yan Yana */}
                <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>

                    {/* ========== SOL PANEL: GENEL ========== */}
                    <Box
                        component="fieldset"
                        sx={{
                            flex: 1,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            p: 3,
                            m: 0,
                        }}
                    >
                        <legend>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', px: 1 }}>
                                Genel
                            </Typography>
                        </legend>

                        {/* Bölüm 1: Kişisel Bilgiler */}
                        <FormRow label="Ad" required>
                            <TextField fullWidth size="small" name="firstName" required value={formData.firstName} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Soyad" required>
                            <TextField fullWidth size="small" name="lastName" required value={formData.lastName} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="T.C. Kimlik Numarası" required>
                            <TextField fullWidth size="small" name="tcIdentityNumber" required slotProps={{ htmlInput: { maxLength: 11 } }} value={formData.tcIdentityNumber} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="E-posta">
                            <TextField fullWidth size="small" name="email" type="email" value={formData.email} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Cinsiyet" required>
                            <Select fullWidth size="small" name="gender" value={formData.gender} onChange={handleSelectChange('gender')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Erkek">Erkek</MenuItem>
                                <MenuItem value="Kadın">Kadın</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Akademik Unvan">
                            <TextField fullWidth size="small" name="academicTitle" value={formData.academicTitle} onChange={handleChange} sx={inputSx} />
                        </FormRow>

                        <RedDivider />

                        {/* Bölüm 2: İş Bilgileri */}
                        <FormRow label="İşe Giriş Tarihi" required>
                            <TextField fullWidth size="small" name="hireDate" type="date" required value={formData.hireDate} onChange={handleChange} sx={inputSx} slotProps={{ inputLabel: { shrink: true } }} />
                        </FormRow>
                        <FormRow label="Sicil No">
                            <TextField fullWidth size="small" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Kadro" required>
                            <Select fullWidth size="small" value={formData.cadre} onChange={handleSelectChange('cadre')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Mühendis">Mühendis</MenuItem>
                                <MenuItem value="İdari Personel">İdari Personel</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Unvan" required>
                            <Select fullWidth size="small" value={formData.title} onChange={handleSelectChange('title')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Aday Mühendis">Aday Mühendis</MenuItem>
                                <MenuItem value="Uzman Mühendis">Uzman Mühendis</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Personel Türü" required>
                            <Select fullWidth size="small" value={formData.personnelType} onChange={handleSelectChange('personnelType')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Tam Zamanlı">Tam Zamanlı</MenuItem>
                                <MenuItem value="Stajyer">Stajyer</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Çalışma Türü" required>
                            <Select fullWidth size="small" value={formData.workType} onChange={handleSelectChange('workType')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Ofis">Ofis</MenuItem>
                                <MenuItem value="Uzaktan">Uzaktan</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Çalışma Durumu" required>
                            <Select fullWidth size="small" value={formData.workStatus} onChange={handleSelectChange('workStatus')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Aktif">Aktif</MenuItem>
                                <MenuItem value="İzinli">İzinli</MenuItem>
                            </Select>
                        </FormRow>

                        <RedDivider />

                        {/* Bölüm 3: Birim / Görev */}
                        <FormRow label="Birim" required>
                            <Select fullWidth size="small" value={formData.department} onChange={handleSelectChange('department')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Yazılım Geliştirme">Yazılım Geliştirme</MenuItem>
                                <MenuItem value="Sistem Yönetimi">Sistem Yönetimi</MenuItem>
                                <MenuItem value="Yönetim">Yönetim</MenuItem>
                                <MenuItem value="QA">QA</MenuItem>
                                <MenuItem value="UI/UX">UI/UX</MenuItem>
                                <MenuItem value="DevOps">DevOps</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Görevi" required>
                            <Select fullWidth size="small" value={formData.duty} onChange={handleSelectChange('duty')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Backend Geliştirme">Backend Geliştirme</MenuItem>
                                <MenuItem value="Frontend Geliştirme">Frontend Geliştirme</MenuItem>
                                <MenuItem value="API Geliştirme">API Geliştirme</MenuItem>
                                <MenuItem value="Proje Yönetimi">Proje Yönetimi</MenuItem>
                                <MenuItem value="Kalite Kontrol">Kalite Kontrol</MenuItem>
                                <MenuItem value="Arayüz Tasarımı">Arayüz Tasarımı</MenuItem>
                                <MenuItem value="Sunucu Yönetimi">Sunucu Yönetimi</MenuItem>
                                <MenuItem value="Veritabanı Yönetimi">Veritabanı Yönetimi</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Takım">
                            <TextField fullWidth size="small" name="team" value={formData.team} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Çalışılan Proje">
                            <Select fullWidth size="small" value={formData.projectWorkedOn} onChange={handleSelectChange('projectWorkedOn')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="PBS">PBS</MenuItem>
                                <MenuItem value="İnfrastruktur">İnfrastruktur</MenuItem>
                            </Select>
                        </FormRow>
                        <FormRow label="Mentor">
                            <TextField fullWidth size="small" name="mentor" value={formData.mentor} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Servis Kullanımı">
                            <Select fullWidth size="small" value={formData.shuttleUsage} onChange={handleSelectChange('shuttleUsage')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="Evet">Evet</MenuItem>
                                <MenuItem value="Hayır">Hayır</MenuItem>
                            </Select>
                        </FormRow>
                    </Box>

                    {/* ========== SAĞ PANEL: DİĞER ========== */}
                    <Box
                        component="fieldset"
                        sx={{
                            flex: 1,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            p: 3,
                            m: 0,
                        }}
                    >
                        <legend>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', px: 1 }}>
                                Diğer
                            </Typography>
                        </legend>

                        {/* Bölüm 1: İletişim */}
                        <FormRow label="İkametgah Adresi">
                            <TextField fullWidth size="small" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Telefon">
                            <TextField fullWidth size="small" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Doğum Tarihi">
                            <TextField fullWidth size="small" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} sx={inputSx} slotProps={{ inputLabel: { shrink: true } }} />
                        </FormRow>
                        <FormRow label="Dahili Numara">
                            <TextField fullWidth size="small" name="extensionNumber" value={formData.extensionNumber} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Oda Numara">
                            <TextField fullWidth size="small" name="roomNumber" value={formData.roomNumber} onChange={handleChange} sx={inputSx} />
                        </FormRow>

                        <RedDivider />

                        {/* Bölüm 2: Araç / Kan Grubu */}
                        <FormRow label="Araç Plakası">
                            <TextField fullWidth size="small" name="licensePlate" value={formData.licensePlate} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Kan Grubu">
                            <Select fullWidth size="small" value={formData.bloodType} onChange={handleSelectChange('bloodType')} displayEmpty sx={selectSx}>
                                <MenuItem value="" disabled><em>Seçiniz</em></MenuItem>
                                <MenuItem value="A+">A Rh(+)</MenuItem>
                                <MenuItem value="A-">A Rh(-)</MenuItem>
                                <MenuItem value="B+">B Rh(+)</MenuItem>
                                <MenuItem value="B-">B Rh(-)</MenuItem>
                                <MenuItem value="AB+">AB Rh(+)</MenuItem>
                                <MenuItem value="AB-">AB Rh(-)</MenuItem>
                                <MenuItem value="0+">0 Rh(+)</MenuItem>
                                <MenuItem value="0-">0 Rh(-)</MenuItem>
                            </Select>
                        </FormRow>

                        <RedDivider />

                        {/* Bölüm 3: Acil Durum */}
                        <FormRow label="Acil Durumda Ulaşılacak Kişi">
                            <TextField fullWidth size="small" name="emergencyContactPerson" value={formData.emergencyContactPerson} onChange={handleChange} sx={inputSx} />
                        </FormRow>
                        <FormRow label="Acil Durumda Ulaşılacak Kişi Tel">
                            <TextField fullWidth size="small" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} sx={inputSx} />
                        </FormRow>

                        <RedDivider />

                        {/* Bölüm 4: Fotoğraf */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', mb: 2 }}>
                                Fotoğraf
                            </Typography>
                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    border: '3px solid #333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    backgroundColor: '#f5f5f5',
                                    mb: 2,
                                }}
                            >
                                {formData.photoUrl ? (
                                    <img
                                        src={formData.photoUrl}
                                        alt="Personel"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <AccountCircleIcon sx={{ fontSize: 100, color: '#bbb' }} />
                                )}
                            </Box>
                            <TextField
                                fullWidth
                                size="small"
                                name="photoUrl"
                                placeholder="Fotoğraf URL'sini yapıştırın"
                                value={formData.photoUrl}
                                onChange={handleChange}
                                sx={{ ...inputSx, maxWidth: 300 }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* ========== GÖNDER BUTONU ========== */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 1.5 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#1a1a1a',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            px: 5,
                            py: 1.2,
                            borderRadius: '4px',
                            boxShadow: 'none',
                            '&:hover': { backgroundColor: '#333', boxShadow: 'none' },
                            '&.Mui-disabled': { backgroundColor: '#999', color: '#fff' },
                        }}
                    >
                        {loading ? 'Kaydediliyor...' : 'PERSONEL EKLE'}
                    </Button>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>E</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
