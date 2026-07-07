import React from 'react';
import { Card, CardContent, Avatar, Typography, Grid, Box, Chip } from '@mui/material';
import {
    BadgeOutlined,
    BusinessOutlined,
    WorkOutline,
    CalendarMonthOutlined,
    PhoneEnabledOutlined,
    MailOutline,
    CakeOutlined,
    DomainOutlined
} from '@mui/icons-material';

export default function EmployeeCard({ employee }) {
    const {
        photoUrl,
        name = "N/A",
        department = "N/A",
        role = "N/A",
        startDate = "N/A",
        registrationNumber = "N/A",
        staffType = "N/A",
        workType = "Tam Zamanlı",
        workingStatus = "Aktif",
        employeeType = "N/A",
        birthDate = "N/A",
        intercom = "N/A",
        officeNumber = "N/A",
        phone = "N/A",
        email = "N/A"
    } = employee || {};

    const translateStatus = (status) => {
        if (!status) return "N/A";
        const s = status.toLowerCase();
        if (s === 'active' || s === 'aktif') return 'Aktif';
        if (s === 'inactive' || s === 'pasif') return 'Pasif';
        return status;
    };

    const translateWorkType = (type) => {
        if (!type) return "N/A";
        const t = type.toLowerCase();
        if (t === 'full-time' || t === 'full time' || t === 'tam zamanlı') return 'Tam Zamanlı';
        if (t === 'part-time' || t === 'part time' || t === 'yarı zamanlı') return 'Yarı Zamanlı';
        if (t === 'intern' || t === 'stajyer') return 'Stajyer';
        return type;
    };

    const currentStatus = translateStatus(workingStatus);
    const isActive = currentStatus === 'Aktif';

    return (
        <Card
            sx={{
                maxWidth: 500,
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                backgroundColor: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    backgroundColor: '#d32f2f',
                }
            }}
        >
            <CardContent sx={{ p: 3, pb: '24px !important' }}>
                <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <Avatar
                        src={photoUrl}
                        alt={name}
                        sx={{ width: 90, height: 90, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Typography variant="h6" fontWeight="700" color="text.primary">
                                {name}
                            </Typography>
                            <Box display="flex" gap={0.5}>
                                <Chip
                                    label={translateWorkType(workType)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                />
                                <Chip
                                    label={currentStatus}
                                    size="small"
                                    color={isActive ? "success" : "error"}
                                    sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#fff' }}
                                />
                            </Box>
                        </Box>

                        <Typography variant="subtitle1" color="primary.main" fontWeight="600" mt={0.5}>
                            {role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {department}
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ fontSize: '0.875rem' }}>

                    <Grid item xs={12} sm={6}>
                        <Box display="flex" flexDirection="column" gap={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <BadgeOutlined fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Sicil No:</strong> {sicilNo}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <BusinessOutlined fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Kadro:</strong> {kadro}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <WorkOutline fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Personel Tipi:</strong> {personelType}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarMonthOutlined fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>İşe Başlama Tarihi:</strong> {startDate}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <CakeOutlined fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Doğum Tarihi:</strong> {birthDate}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box display="flex" flexDirection="column" gap={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <PhoneEnabledOutlined fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Dahili Telefon:</strong> {dahiliPhone}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <DomainOutlined fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Ofis No:</strong> {officeNumber}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <PhoneEnabledOutlined fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Telefon:</strong> {phone}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
                                <MailOutline fontSize="small" color="action" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                    title={email}
                                >
                                    <strong>E-posta:</strong> {email}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    );
}