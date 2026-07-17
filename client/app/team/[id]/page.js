'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import EmployeeCard from '../components/EmployeeCard';
import RoleGuard from '../../components/RoleGuard';
import { getPersonnelDirectoryEntry, getPersonnelInfo } from '../../personel/services/personnelDetailService';

export default function EmployeeProfilePage({ params }) {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                // First get the directory entry to find the email
                const directoryEntry = await getPersonnelDirectoryEntry(params.id);
                if (directoryEntry && directoryEntry.email) {
                    // Then get the full details using the email
                    const fullInfo = await getPersonnelInfo(directoryEntry.email);
                    if (fullInfo) {
                        setEmployee({
                            photoUrl: fullInfo.photoUrl || directoryEntry.photoUrl,
                            name: `${fullInfo.firstName || ''} ${fullInfo.lastName || ''}`.trim() || directoryEntry.fullName,
                            department: fullInfo.department || directoryEntry.unit,
                            role: fullInfo.title || directoryEntry.title,
                            startDate: fullInfo.hireDate,
                            registrationNumber: fullInfo.registrationNumber,
                            staffType: fullInfo.cadre,
                            workType: fullInfo.workType,
                            workingStatus: fullInfo.workStatus,
                            employeeType: fullInfo.personnelType,
                            birthDate: fullInfo.birthDate,
                            intercom: fullInfo.extensionNumber,
                            officeNumber: fullInfo.roomNumber,
                            phone: fullInfo.phoneNumber || directoryEntry.phoneNumber,
                            email: fullInfo.email || directoryEntry.email
                        });
                    }
                }
            } catch (err) {
                console.error("Çalışan bilgileri alınamadı:", err);
                setError("Personel bulunamadı veya yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        if (params?.id) {
            fetchEmployee();
        }
    }, [params?.id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !employee) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
                <Typography color="error">{error || "Personel bulunamadı."}</Typography>
            </Box>
        );
    }

    return (
        <RoleGuard allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
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
            <Container
                maxWidth="lg"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Typography
                    variant="h5"
                    fontWeight="600"
                    color="text.secondary"
                    align="center"
                    mb={4}
                >
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

                    <EmployeeCard employee={employee} />
                </Box>


            </Container>
        </Box>
        </RoleGuard>
    );
}