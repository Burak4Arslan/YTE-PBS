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
