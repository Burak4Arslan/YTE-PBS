import api from "../../api/axiosInstance";

/**
 * Backend'deki DirectoryEntry entity'si şu alanları döndürüyor:
 * { id, fullName, unit, title, duty, project, email, phoneNumber }
 *
 * Frontend component'leri (PersonCell, GorevCell, ContactCell) ise
 * adSoyad / birim / unvan / gorevler / ePosta / telefon isimlerini bekliyor.
 * Bu fonksiyon ikisi arasındaki farkı tek bir yerden yönetir.
 */
function mapDirectoryEntryToRehberRow(entry) {
    return {
        id: entry.id,
        adSoyad: entry.fullName,
        birim: entry.unit,
        unvan: entry.title,
        gorevler: [entry.duty, entry.project].filter(Boolean),
        ePosta: entry.email,
        telefon: entry.phoneNumber,
        avatarUrl: null,
    };
}

/**
 * GET /api/directory
 */
export async function fetchRehberList(filters = {}) {
    const params = new URLSearchParams();
    if (filters.isimSoyisim) params.append("fullName", filters.isimSoyisim);
    if (filters.unvan) params.append("title", filters.unvan);
    if (filters.gorev) params.append("duty", filters.gorev);
    if (filters.birim) params.append("unit", filters.birim);
    if (filters.proje) params.append("project", filters.proje);

    const response = await api.get(`/api/directory?${params.toString()}`);
    return response.data.map(mapDirectoryEntryToRehberRow);
}

export async function fetchTitles() {
    const response = await api.get("/api/directory/options/titles");
    return response.data;
}

export async function fetchDuties() {
    const response = await api.get("/api/directory/options/duties");
    return response.data;
}

export async function fetchUnits() {
    const response = await api.get("/api/directory/options/units");
    return response.data;
}

export async function fetchProjects() {
    const response = await api.get("/api/directory/options/projects");
    return response.data;
}