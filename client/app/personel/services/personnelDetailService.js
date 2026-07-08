import axiosInstance from '../../api/axiosInstance';

export async function getPersonnelEmail(personnelId) {
    const { data } = await axiosInstance.get('/api/directory');
    const personnel = data.find((entry) => String(entry.id) === String(personnelId));

    if (!personnel?.email) throw new Error('Personel bilgisi bulunamadı.');
    return personnel.email;
}

export async function getEducations(email) {
    const { data } = await axiosInstance.get('/api/educations', { params: { email } });
    return data;
}

export async function createEducation(email, education) {
    const { data } = await axiosInstance.post('/api/educations', education, { params: { email } });
    return data;
}

export async function updateEducation(educationId, education) {
    const { data } = await axiosInstance.put(`/api/educations/${educationId}`, education);
    return data;
}

export async function deleteEducation(educationId) {
    await axiosInstance.delete(`/api/educations/${educationId}`);
}

export async function getPersonnelProjects(email) {
    const { data } = await axiosInstance.get('/api/user-projects', { params: { email } });
    return data;
}

export async function getExperiences(email) {
    const { data } = await axiosInstance.get('/api/experiences', { params: { email } });
    return data;
}

export async function createExperience(email, experience) {
    const { data } = await axiosInstance.post('/api/experiences', experience, { params: { email } });
    return data;
}

export async function updateExperience(experienceId, experience) {
    const { data } = await axiosInstance.put(`/api/experiences/${experienceId}`, experience);
    return data;
}

export async function deleteExperience(experienceId) {
    await axiosInstance.delete(`/api/experiences/${experienceId}`);
}

export async function getContributions(email) {
    const { data } = await axiosInstance.get('/api/contributions', { params: { email } });
    return data;
}

export async function createContribution(email, contribution) {
    // Support file upload when contribution.attachment is provided
    if (contribution && (contribution.attachment instanceof File || (Array.isArray(contribution.attachment) && contribution.attachment[0] instanceof File))) {
        const fd = new FormData();
        fd.append('type', contribution.type || '');
        fd.append('description', contribution.description || '');
        fd.append('link', contribution.link || '');
        if (contribution.uploadDate) fd.append('uploadDate', contribution.uploadDate);
        const file = contribution.attachment instanceof File ? contribution.attachment : contribution.attachment[0];
        if (file) fd.append('attachment', file);
        const { data } = await axiosInstance.post('/api/contributions', fd, { params: { email }, headers: { 'Content-Type': 'multipart/form-data' } });
        return data;
    }

    const { data } = await axiosInstance.post('/api/contributions', contribution, { params: { email } });
    return data;
}

export async function updateContribution(contributionId, contribution) {
    // Support updating with optional file upload
    if (contribution && (contribution.attachment instanceof File || (Array.isArray(contribution.attachment) && contribution.attachment[0] instanceof File))) {
        const fd = new FormData();
        fd.append('type', contribution.type || '');
        fd.append('description', contribution.description || '');
        fd.append('link', contribution.link || '');
        if (contribution.uploadDate) fd.append('uploadDate', contribution.uploadDate);
        const file = contribution.attachment instanceof File ? contribution.attachment : contribution.attachment[0];
        if (file) fd.append('attachment', file);
        const { data } = await axiosInstance.put(`/api/contributions/${contributionId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        return data;
    }

    const { data } = await axiosInstance.put(`/api/contributions/${contributionId}`, contribution);
    return data;
}

export async function deleteContribution(contributionId) {
    await axiosInstance.delete(`/api/contributions/${contributionId}`);
}

