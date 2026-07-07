'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import PersonalCorporateInfo from '../../team/components/PersonalCorporateInfo';
import PersonnelFiles from '../components/PersonnelFiles';
import PersonnelProjectsSection from '../components/PersonnelProjectsSection';
import PersonnelEducationSection from '../components/PersonnelEducationSection';
import { createEducation, deleteEducation, getEducations, getPersonnelEmail, getPersonnelProjects, updateEducation } from '../services/personnelDetailService';

export default function PersonnelDetailPage() {
    const params = useParams();
    const userId = params.id;
    const [email, setEmail] = useState('');
    const [educations, setEducations] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadDetails = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const resolvedEmail = await getPersonnelEmail(userId);
            setEmail(resolvedEmail);
            const [educationData, projectData] = await Promise.all([getEducations(resolvedEmail), getPersonnelProjects(resolvedEmail)]);
            setEducations(educationData);
            setProjects(projectData);
        } catch (requestError) {
            setError(requestError.message || 'Personel detayları yüklenemedi.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { queueMicrotask(loadDetails); }, [loadDetails]);

    const handleSave = async (values, educationId) => {
        setSaving(true);
        try {
            if (educationId) await updateEducation(educationId, values);
            else await createEducation(email, values);
            setEducations(await getEducations(email));
            toast.success(educationId ? 'Eğitim bilgisi güncellendi.' : 'Eğitim bilgisi eklendi.');
            return true;
        } catch { return false; }
        finally { setSaving(false); }
    };

    const handleDelete = async (educationId) => {
        setSaving(true);
        try {
            await deleteEducation(educationId);
            setEducations(await getEducations(email));
            toast.success('Eğitim bilgisi silindi.');
            return true;
        } catch { return false; }
        finally { setSaving(false); }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                py: 2
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    px: {
                        xs: 2,
                        md: 3
                    }
                }}
            >
                <Stack spacing={2}>
                    <PersonalCorporateInfo />
                    <PersonnelFiles userId={userId} />
                    <PersonnelProjectsSection projects={projects} loading={loading} error={error} />
                    <PersonnelEducationSection educations={educations} loading={loading} error={error} saving={saving} onSave={handleSave} onDelete={handleDelete} />
                </Stack>
            </Container>
        </Box>
    );
}
