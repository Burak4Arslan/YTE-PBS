'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import EmployeeCard from '../components/EmployeeCard';

export default function EmployeeProfilePage({ params }) {
    const sampleEmployee = {
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=190",
        name: "Dr. Cenk Çelik",
        department: "Dijital Strateji ve Dijital Dönüşüm Planlama",
        role: "Kıdemli Uzman Araştırmacı - Proje Yöneticisi - MGM",
        startDate: "12-04-2023",
        registrationNumber: "00000",
        staffType: "AG",
        workType: "Tam Zamanlı",
        workingStatus: "Aktif",
        employeeType: "MARTEK",
        birthDate: "12-05-1995",
        intercom: "3940",
        officeNumber: "216",
        phone: "0655 555 55 55",
        email: "cenk.celil@tubitak.gov.tr"
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                p: 3
            }}
        >
            <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                    variant="h5"
                    fontWeight="600"
                    color="text.secondary"
                    align="center"
                    mb={4}
                >
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <EmployeeCard employee={sampleEmployee} />
                </Box>
            </Container>
        </Box>
    );
}