'use client';
import RoleGuard from '../components/RoleGuard';
import { Box } from '@mui/material';
import PersonnelSectionCard from './components/PersonnelSectionCard';

export default function OrganizasyonSemasiPage() {
    return (
        <RoleGuard allowedRoles={['EMPLOYEE', 'ADMIN']}>
            <Box sx={{ p: 4 }}>
                <PersonnelSectionCard />
            </Box>
        </RoleGuard>
    );
}