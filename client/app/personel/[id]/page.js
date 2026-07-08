'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import PersonalCorporateInfo from '../../team/components/PersonalCorporateInfo';
import PersonnelFiles from '../components/PersonnelFiles';
import PersonnelProjectsSection from '../components/PersonnelProjectsSection';
import PersonnelEducationSection from '../components/PersonnelEducationSection';
import PersonnelExperienceSection from '../components/PersonnelExperienceSection';
import PersonnelContributionsSection from '../components/PersonnelContributionsSection';
import { createEducation, deleteEducation, getEducations, getPersonnelEmail, getPersonnelProjects, updateEducation, getExperiences, createExperience, updateExperience, deleteExperience, getContributions, createContribution, updateContribution, deleteContribution } from '../services/personnelDetailService';

export default function PersonnelDetailPage() {
    const params = useParams();
    const userId = params.id;
    const [email, setEmail] = useState('');
    const [educations, setEducations] = useState([]);
    const [projects, setProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadDetails = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const resolvedEmail = await getPersonnelEmail(userId);
            setEmail(resolvedEmail);
            const [educationData, projectData, experienceData, contributionData] = await Promise.all([getEducations(resolvedEmail), getPersonnelProjects(resolvedEmail), getExperiences(resolvedEmail), getContributions(resolvedEmail)]);
            setEducations(educationData);
            setProjects(projectData);
            setExperiences(experienceData);
            setContributions(contributionData);
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

    const handleExperienceSave = async (values, experienceId) => {
        setSaving(true);
        try {
            if (experienceId) await updateExperience(experienceId, values);
            else await createExperience(email, values);
            setExperiences(await getExperiences(email));
            toast.success(experienceId ? 'Deneyim güncellendi.' : 'Deneyim eklendi.');
            return true;
        } catch { return false; }
        finally { setSaving(false); }
    };

    const handleExperienceDelete = async (experienceId) => {
        setSaving(true);
        try {
            await deleteExperience(experienceId);
            setExperiences(await getExperiences(email));
            toast.success('Deneyim silindi.');
            return true;
        } catch { return false; }
        finally { setSaving(false); }
    };

    const handleContributionSave = async (values, contributionId) => {
        setSaving(true);
        try {
            // if the drawer passes an attachment FileList, ensure we send the File object
            const payload = { ...values };
            if (payload.attachment && payload.attachment.length) payload.attachment = payload.attachment[0];
            if (contributionId) await updateContribution(contributionId, payload);
            else await createContribution(email, payload);
            setContributions(await getContributions(email));
            toast.success(contributionId ? 'Katkı güncellendi.' : 'Katkı eklendi.');
            return true;
        } catch (e) { console.error(e); return false; }
        finally { setSaving(false); }
    };

    const handleContributionDelete = async (contributionId) => {
        setSaving(true);
        try {
            await deleteContribution(contributionId);
            setContributions(await getContributions(email));
            toast.success('Katkı silindi.');
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
                    <PersonnelFiles email={email} />
                    <PersonnelProjectsSection projects={projects} loading={loading} error={error} />
                    <PersonnelExperienceSection experiences={experiences} loading={loading} error={error} saving={saving} onSave={handleExperienceSave} onDelete={handleExperienceDelete} />
                    <PersonnelEducationSection educations={educations} loading={loading} error={error} saving={saving} onSave={handleSave} onDelete={handleDelete} />
                    <PersonnelContributionsSection contributions={contributions} loading={loading} error={error} saving={saving} onSave={handleContributionSave} onDelete={handleContributionDelete} />
                </Stack>
            </Container>
        </Box>
    );
}
