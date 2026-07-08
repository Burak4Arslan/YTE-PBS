'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Box,
    CircularProgress,
    Container,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import TeamMembersCard from '../personel/components/TeamMembersCard';
import AttendanceCard from '../personel/components/AttendanceCard';
import PersonnelProjectsSection from '../personel/components/PersonnelProjectsSection';
import PersonnelSectionCard from '../personel/components/PersonnelSectionCard';
import axiosInstance from '../api/axiosInstance';
import {
    getEducations,
    getPersonnelInfo,
    getPersonnelProjects
} from '../personel/services/personnelDetailService';

function formatDate(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('tr-TR').format(new Date(`${value}T00:00:00`));
}

function normalize(value) {
    return value || '-';
}

function EmployeeSummaryCard({ directoryEntry, personnel, loading, error }) {
    const fullName = [personnel?.academicTitle, directoryEntry?.fullName].filter(Boolean).join(' ') || '-';
    const titleText = [directoryEntry?.title, directoryEntry?.duty, directoryEntry?.project].filter(Boolean).join(' - ');

    const rows = [
        ['İşe Giriş Tarihi', formatDate(personnel?.hireDate || personnel?.employmentStartDate)],
        ['Doğum Tarihi', formatDate(personnel?.birthDate)],
        ['Sicil No', normalize(personnel?.registrationNumber)],
        ['Dahili', normalize(personnel?.internalPhoneNumber)],
        ['Kadro', normalize(personnel?.cadre)],
        ['Oda', normalize(personnel?.roomNumber)],
        ['Çalışma Türü', normalize(personnel?.workType)],
        ['Telefon', normalize(personnel?.phoneNumber || directoryEntry?.phoneNumber)],
        ['Çalışma Durumu', normalize(personnel?.workStatus)],
        ['E-Posta', normalize(personnel?.email || directoryEntry?.email)],
        ['Personel Türü', normalize(personnel?.personnelType)]
    ];

    return (
        <PersonnelSectionCard title="PERSONEL BİLGİLERİ" icon={<PersonOutlinedIcon color="primary" fontSize="small" />}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : error ? (
                <Typography variant="body2" color="error">{error}</Typography>
            ) : (
                <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar
                            src={personnel?.profileImageUrl || undefined}
                            sx={{ width: 72, height: 72, bgcolor: 'grey.400', flexShrink: 0 }}
                        >
                            {!personnel?.profileImageUrl && <PersonOutlinedIcon />}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" fontWeight={700}>{fullName}</Typography>
                            <Typography variant="body2" color="text.secondary">{directoryEntry?.unit || '-'}</Typography>
                            <Typography variant="body2" fontStyle="italic" sx={{ mt: 0.5 }}>
                                {titleText || '-'}
                            </Typography>
                        </Box>
                    </Box>

                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                {rows.map(([label, value]) => (
                                    <TableRow key={label}>
                                        <TableCell sx={{ borderBottom: 0, width: '24%', fontWeight: 700, pl: 0 }}>{label}</TableCell>
                                        <TableCell sx={{ borderBottom: 0, width: '26%' }}>{value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            )}
        </PersonnelSectionCard>
    );
}

function EducationReadonlySection({ educations, loading }) {
    return (
        <PersonnelSectionCard title="EĞİTİM" icon={<SchoolOutlinedIcon color="primary" fontSize="small" />}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : (
                <TableContainer>
                    <Table size="small" sx={{ minWidth: 820 }}>
                        <TableBody>
                            {educations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        Eğitim bilgisi bulunamadı.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Eğitim Türü</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Üniversite/Okul</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Bölüm</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Başlangıç Tarihi</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Mezuniyet Tarihi</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Açıklama</TableCell>
                                    </TableRow>
                                    {educations.map((education) => (
                                        <TableRow key={education.id} hover>
                                            <TableCell>{education.educationType || '-'}</TableCell>
                                            <TableCell>{education.schoolName || '-'}</TableCell>
                                            <TableCell>{education.department || '-'}</TableCell>
                                            <TableCell>{formatDate(education.startDate)}</TableCell>
                                            <TableCell>{education.graduationDate ? formatDate(education.graduationDate) : 'Devam Ediyor'}</TableCell>
                                            <TableCell>{education.description || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </PersonnelSectionCard>
    );
}

export default function MyTeamPage() {
    const [directory, setDirectory] = useState([]);
    const [selectedPersonnelId, setSelectedPersonnelId] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [personnel, setPersonnel] = useState(null);
    const [projects, setProjects] = useState([]);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;

        const loadInitialData = async () => {
            setLoading(true);
            setError('');
            try {
                const [{ data: me }, { data: directoryData }] = await Promise.all([
                    axiosInstance.get('/api/personel/hakkımda'),
                    axiosInstance.get('/api/directory')
                ]);

                if (ignore) return;

                const currentEntry = directoryData.find(
                    (entry) => entry.email?.toLowerCase() === me.email?.toLowerCase()
                );

                setDirectory(directoryData);
                setSelectedPersonnelId(currentEntry?.id || directoryData[0]?.id || null);
            } catch (requestError) {
                console.error(requestError);
                if (!ignore) {
                    setError('Ekibim bilgileri yüklenemedi.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            ignore = true;
        };
    }, []);

    const selectedDirectoryEntry = useMemo(
        () => directory.find((entry) => String(entry.id) === String(selectedPersonnelId)),
        [directory, selectedPersonnelId]
    );

    const loadSelectedDetails = useCallback(async () => {
        if (!selectedDirectoryEntry?.email) {
            setSelectedEmail('');
            setPersonnel(null);
            setProjects([]);
            setEducations([]);
            return;
        }

        setDetailsLoading(true);
        setSelectedEmail(selectedDirectoryEntry.email);
        try {
            const [personnelData, projectData, educationData] = await Promise.all([
                getPersonnelInfo(selectedDirectoryEntry.email).catch(() => null),
                getPersonnelProjects(selectedDirectoryEntry.email),
                getEducations(selectedDirectoryEntry.email)
            ]);

            setPersonnel(personnelData);
            setProjects(projectData);
            setEducations(educationData);
        } catch (requestError) {
            console.error(requestError);
            setPersonnel(null);
            setProjects([]);
            setEducations([]);
        } finally {
            setDetailsLoading(false);
        }
    }, [selectedDirectoryEntry]);

    useEffect(() => {
        queueMicrotask(loadSelectedDetails);
    }, [loadSelectedDetails]);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 2 }}>
            <Container maxWidth={false} sx={{ px: { xs: 2, md: 3 } }}>
                <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TeamMembersCard
                            currentPersonnelId={selectedPersonnelId}
                            onSelectMember={setSelectedPersonnelId}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={2}>
                            <EmployeeSummaryCard
                                directoryEntry={selectedDirectoryEntry}
                                personnel={personnel}
                                loading={loading || detailsLoading}
                                error={error}
                            />
                            <PersonnelProjectsSection projects={projects} loading={detailsLoading} error="" />
                            <EducationReadonlySection educations={educations} loading={detailsLoading} />
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <AttendanceCard email={selectedEmail} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
