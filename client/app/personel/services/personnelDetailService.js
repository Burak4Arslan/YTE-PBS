import axiosInstance from '../../api/axiosInstance';

function mapExperienceFromApi(experience) {
    return {
        ...experience,
        company: experience.company || experience.workPlace || '',
        position: experience.position || experience.role || '',
        employmentType: experience.employmentType || experience.workType || '',
        leavingReason: experience.leavingReason || experience.reasonOfLeave || ''
    };
}

function mapExperienceToApi(experience) {
    return {
        id: experience.id,
        userId: experience.userId,
        workPlace: experience.workPlace || experience.company || '',
        role: experience.role || experience.position || '',
        workType: experience.workType || experience.employmentType || '',
        startDate: experience.startDate || null,
        endDate: experience.endDate || null,
        reasonOfLeave: experience.reasonOfLeave || experience.leavingReason || ''
    };
}

function getFileName(filePath) {
    if (!filePath) return '';
    return String(filePath).split(/[\\/]/).pop();
}

function resolveAttachmentPath(contribution) {
    const attachment = contribution.attachment;
    const fileConstructorAvailable = typeof File !== 'undefined';

    if (fileConstructorAvailable && attachment instanceof File) return attachment.name;
    if (fileConstructorAvailable && attachment?.length && attachment[0] instanceof File) return attachment[0].name;

    return contribution.attachedFilePath || contribution.attachmentName || '';
}

function mapContributionFromApi(contribution) {
    return {
        ...contribution,
        type: contribution.type || contribution.eventType || '',
        attachmentName: contribution.attachmentName || getFileName(contribution.attachedFilePath)
    };
}

function mapContributionToApi(contribution) {
    return {
        id: contribution.id,
        userId: contribution.userId,
        eventType: contribution.eventType || contribution.type || '',
        description: contribution.description || '',
        link: contribution.link || '',
        attachedFilePath: resolveAttachmentPath(contribution),
        uploadDate: contribution.uploadDate || null
    };
}

export async function getPersonnelEmail(personnelId) {
    const { data } = await axiosInstance.get('/api/directory');
    const personnel = data.find((entry) => String(entry.id) === String(personnelId));

    if (!personnel?.email) throw new Error('Personel bilgisi bulunamadı.');
    return personnel.email;
}

export async function getPersonnelDirectoryEntry(personnelId) {
    const { data } = await axiosInstance.get('/api/directory');
    const personnel = data.find((entry) => String(entry.id) === String(personnelId));

    if (!personnel) throw new Error('Personel bilgisi bulunamadı.');
    return personnel;
}

export async function getPersonnelInfo(email) {
    const { data } = await axiosInstance.get('/api/personnel', { params: { email } });
    return data || null;
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
    return data.map(mapExperienceFromApi);
}

export async function createExperience(email, experience) {
    const { data } = await axiosInstance.post('/api/experiences', mapExperienceToApi(experience), { params: { email } });
    return mapExperienceFromApi(data);
}

export async function updateExperience(experienceId, experience) {
    const { data } = await axiosInstance.put(`/api/experiences/${experienceId}`, mapExperienceToApi(experience));
    return mapExperienceFromApi(data);
}

export async function deleteExperience(experienceId) {
    await axiosInstance.delete(`/api/experiences/${experienceId}`);
}

export async function getContributions(email) {
    const { data } = await axiosInstance.get('/api/contributions', { params: { email } });
    return data.map(mapContributionFromApi);
}

export async function createContribution(email, contribution) {
    const { data } = await axiosInstance.post('/api/contributions', mapContributionToApi(contribution), { params: { email } });
    return mapContributionFromApi(data);
}

export async function updateContribution(contributionId, contribution) {
    const { data } = await axiosInstance.put(`/api/contributions/${contributionId}`, mapContributionToApi(contribution));
    return mapContributionFromApi(data);
}

export async function deleteContribution(contributionId) {
    await axiosInstance.delete(`/api/contributions/${contributionId}`);
}

export async function getMyAttendanceRecords(range = 'week') {
    const { data } = await axiosInstance.get('/api/attendance/me', { params: { range } });
    return data;
}

