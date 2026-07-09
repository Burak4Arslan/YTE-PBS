"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogContent, Box, Typography, IconButton,
    Divider, Avatar, CircularProgress, Grid, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import PersonnelProjectsSection from '../../personel/components/PersonnelProjectsSection';
import PersonnelSectionCard from '../../personel/components/PersonnelSectionCard';
import {
    getPersonnelDirectoryEntry,
    getPersonnelInfo,
    getEducations,
    getPersonnelProjects,
    getExperiences,
    getContributions,
} from '../../personel/services/personnelDetailService';

const formatDate = (value) => value ? new Intl.DateTimeFormat('tr-TR').format(new Date(`${value}T00:00:00`)) : 'Devam Ediyor';
const fmtDate = (value) => value ? new Intl.DateTimeFormat('tr-TR').format(new Date(`${value}T00:00:00`)) : '—';

export default function RehberDetayModal({ personelId, isOpen, onClose }) {
    const [user, setUser] = useState(null);
    const [personnel, setPersonnel] = useState(null);
    const [projects, setProjects] = useState([]);
    const [educations, setEducations] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState('');
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');

    useEffect(() => {
        if (!isOpen || !personelId) return;

        setUser(null);
        setPersonnel(null);
        setProjects([]);
        setEducations([]);
        setExperiences([]);
        setContributions([]);

        setLoading(true);
        setProjectsLoading(true);
        setProjectsError('');
        setDetailsLoading(true);
        setDetailsError('');

        let isMounted = true;

        (async () => {
            let entry;
            try {
                entry = await getPersonnelDirectoryEntry(personelId);
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setDetailsError('Personel bilgisi bulunamadı.');
                    setLoading(false);
                    setDetailsLoading(false);
                    setProjectsLoading(false);
                }
                return;
            }

            if (!isMounted) return;
            setUser(entry);

            const [projectsRes, personnelRes, educationRes, experienceRes, contributionRes] = await Promise.allSettled([
                getPersonnelProjects(entry.email),
                getPersonnelInfo(entry.email),
                getEducations(entry.email),
                getExperiences(entry.email),
                getContributions(entry.email),
            ]);
            if (!isMounted) return;

            setProjects(projectsRes.status === 'fulfilled' ? (projectsRes.value || []) : []);
            setPersonnel(personnelRes.status === 'fulfilled' ? (personnelRes.value || null) : null);
            setEducations(educationRes.status === 'fulfilled' ? (educationRes.value || []) : []);
            setExperiences(experienceRes.status === 'fulfilled' ? (experienceRes.value || []) : []);
            setContributions(contributionRes.status === 'fulfilled' ? (contributionRes.value || []) : []);
            setLoading(false);
            setDetailsLoading(false);
            setProjectsLoading(false);
        })();

        return () => {
            isMounted = false;
        };
    }, [personelId, isOpen]);


    return (
        <Dialog
            disableScrollLock
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{ paper: { sx: { p: 2, borderRadius: 1 } } }}
        >
            {/* Kapatma Butonu */}
            <IconButton
                onClick={onClose}
                sx={{ position: "absolute", right: 16, top: 16, color: "grey.500" }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent sx={{ pt: 2 }}>
                {/* Sol Üst Başlık Logosu */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#7b1fa2" }}>
                        ❖ Rehber Detay
                    </Typography>
                </Box>
                <Divider sx={{ mb: 4, borderColor: "grey.300" }} />

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* ÜST PROFiL KARTI */}
                        {user && (
                        <>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 4 }}>
                            <Avatar
                                src={personnel?.photoUrl}
                                sx={{ width: 88, height: 88, bgcolor: "grey.200", border: "1px solid #e0e0e0" }}
                            />

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "grey.900" }}>
                                    {[personnel?.academicTitle, user.fullName].filter(Boolean).join(' ')}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "grey.700", mt: 0.5 }}>
                                    {user.unit}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "grey.500" }}>
                                    {[user.title, user.duty, user.project].filter(Boolean).join(' - ')}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 1,
                                minWidth: { md: 320 },
                                borderLeft: { md: "1px solid #e0e0e0" },
                                pl: { md: 3 }
                            }}>
                                <Typography variant="body2"><Box component="span" sx={{ color: "grey.500" }}>Oda:</Box> <strong>{personnel?.roomNumber || '—'}</strong></Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <EmailIcon sx={{ fontSize: 16, color: "grey.400" }} />
                                    <Typography variant="body2" component="a" href={`mailto:${user.email}`} sx={{ color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                                        {user.email}
                                    </Typography>
                                </Box>
                                <Typography variant="body2"><Box component="span" sx={{ color: "grey.500" }}>Sicil No:</Box> <strong>{personnel?.registrationNumber || '—'}</strong></Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <PhoneIcon sx={{ fontSize: 16, color: "grey.400" }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.phoneNumber || personnel?.phoneNumber || '—'}</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* GENEL BÖLÜMÜ */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, borderBottom: "1px solid #212121", pb: 0.5, mb: 2 }}>
                                Genel
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { label: "İşe Giriş Tarihi", val: fmtDate(personnel?.hireDate) },
                                    { label: "Kadro", val: personnel?.cadre || '—' },
                                    { label: "Çalışma Türü", val: personnel?.workType || '—' },
                                    { label: "Çalışma Durumu", val: personnel?.workStatus || '—', isStatus: true },
                                    { label: "Personel Türü", val: personnel?.personnelType || '—' },
                                    { label: "Doğum Tarihi", val: fmtDate(personnel?.birthDate) },
                                ].map((item, idx) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={idx} sx={{ display: "flex", justifyContent: "space-between", gap: 2, pr: { md: 4 } }}>
                                        <Typography variant="body2" sx={{ color: "grey.500", fontWeight: 600 }}>{item.label}</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: item.isStatus ? "success.main" : "grey.900" }}>
                                            {item.val}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        </>
                        )}

                        {/* DAHİL OLUNAN PROJELER BÖLÜMÜ */}
                        <Box sx={{ mb: 4 }}>
                            <PersonnelProjectsSection
                                projects={projects}
                                loading={projectsLoading}
                                error={projectsError}
                            />
                        </Box>

                        {/* DENEYİM BÖLÜMÜ */}
                        <Box sx={{ mb: 4 }}>
                            <PersonnelSectionCard title="DENEYİM" icon={<BusinessCenterOutlinedIcon color="primary" fontSize="small" />}>
                                {detailsLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box>
                                ) : detailsError ? (
                                    <Alert severity="error">{detailsError}</Alert>
                                ) : (
                                    <TableContainer><Table size="small" sx={{ minWidth: 1050 }}>
                                        <TableHead><TableRow>
                                            <TableCell>Çalıştığı Kurum Adı</TableCell>
                                            <TableCell>Çalıştığı Pozisyon</TableCell>
                                            <TableCell>Çalışma Şekli</TableCell>
                                            <TableCell>İşe Başlama Tarihi</TableCell>
                                            <TableCell>İşten Çıkış Tarihi</TableCell>
                                            <TableCell>İşten Ayrılış Nedeni</TableCell>
                                        </TableRow></TableHead>
                                        <TableBody>{experiences.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>İş deneyimi bulunamadı.</TableCell></TableRow>
                                        ) : experiences.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{item.workPlace || '—'}</TableCell>
                                                <TableCell>{item.role || '—'}</TableCell>
                                                <TableCell>{item.workType || '—'}</TableCell>
                                                <TableCell>{formatDate(item.startDate)}</TableCell>
                                                <TableCell>{formatDate(item.endDate)}</TableCell>
                                                <TableCell>{item.reasonOfLeave || '—'}</TableCell>
                                            </TableRow>
                                        ))}</TableBody>
                                    </Table></TableContainer>
                                )}
                            </PersonnelSectionCard>
                        </Box>

                        {/* EĞİTİM BÖLÜMÜ */}
                        <Box sx={{ mb: 4 }}>
                            <PersonnelSectionCard title="EĞİTİM" icon={<SchoolOutlinedIcon color="primary" fontSize="small" />}>
                                {detailsLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box>
                                ) : detailsError ? (
                                    <Alert severity="error">{detailsError}</Alert>
                                ) : (
                                    <TableContainer><Table size="small" sx={{ minWidth: 1050 }}>
                                        <TableHead><TableRow>
                                            <TableCell>Eğitim Türü</TableCell>
                                            <TableCell>Üniversite/Okul</TableCell>
                                            <TableCell>Bölüm</TableCell>
                                            <TableCell>Başlangıç Tarihi</TableCell>
                                            <TableCell>Mezuniyet Tarihi</TableCell>
                                            <TableCell>Açıklama</TableCell>
                                        </TableRow></TableHead>
                                        <TableBody>{educations.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Eğitim bilgisi bulunamadı.</TableCell></TableRow>
                                        ) : educations.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{item.educationType}</TableCell>
                                                <TableCell>{item.schoolName}</TableCell>
                                                <TableCell>{item.department}</TableCell>
                                                <TableCell>{formatDate(item.startDate)}</TableCell>
                                                <TableCell>{formatDate(item.graduationDate)}</TableCell>
                                                <TableCell>{item.description || '—'}</TableCell>
                                            </TableRow>
                                        ))}</TableBody>
                                    </Table></TableContainer>
                                )}
                            </PersonnelSectionCard>
                        </Box>

                        {/* KATKILAR BÖLÜMÜ */}
                        <Box sx={{ mb: 4 }}>
                            <PersonnelSectionCard title="KATKILAR" icon={<LibraryBooksOutlinedIcon color="primary" fontSize="small" />}>
                                {detailsLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box>
                                ) : detailsError ? (
                                    <Alert severity="error">{detailsError}</Alert>
                                ) : (
                                    <TableContainer><Table size="small" sx={{ minWidth: 760 }}>
                                        <TableHead><TableRow>
                                            <TableCell>Etkinlik Türü</TableCell>
                                            <TableCell>Açıklama</TableCell>
                                            <TableCell>Link</TableCell>
                                            <TableCell>Ek</TableCell>
                                            <TableCell>Yüklenme Tarihi</TableCell>
                                        </TableRow></TableHead>
                                        <TableBody>{contributions.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Katkı bilgisi bulunamadı.</TableCell></TableRow>
                                        ) : contributions.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{item.eventType || '—'}</TableCell>
                                                <TableCell>{item.description || '—'}</TableCell>
                                                <TableCell>{item.link ? <a href={item.link} target="_blank" rel="noreferrer">{item.link}</a> : '—'}</TableCell>
                                                <TableCell>{item.attachedFilePath ? item.attachedFilePath.split('/').pop() : '—'}</TableCell>
                                                <TableCell>{formatDate(item.uploadDate)}</TableCell>
                                            </TableRow>
                                        ))}</TableBody>
                                    </Table></TableContainer>
                                )}
                            </PersonnelSectionCard>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
