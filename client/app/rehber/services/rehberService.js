import api from "../../api/axiosInstance";

/**
 * Backend'deki DirectoryEntry entity'si şu alanları döndürüyor:
 * { id, fullName, unit, title, duty, project, email, phoneNumber }
 *
 * Frontend component'leri (PersonCell, GorevCell, ContactCell) ise
 * adSoyad / birim / unvan / gorevler / ePosta / telefon isimlerini bekliyor.
 * Bu fonksiyon ikisi arasındaki farkı tek bir yerden yönetir; backend alan
 * isimleri değişirse sadece burası güncellenir, component'lere dokunmaya
 * gerek kalmaz.
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
 * Not: Backend şu an query parametresi ile filtreleme desteklemiyor
 * (controller sadece findAll() dönüyor). Bu yüzden filtreleri şimdilik
 * frontend tarafında (RehberView içinde) uyguluyoruz. Backend'e filtre
 * parametreleri eklendiğinde, bu fonksiyona `{ params: filters }` eklenip
 * client-side filtreleme kaldırılabilir.
 */
export async function fetchRehberList() {
    const response = await api.get("/api/directory");
    return response.data.map(mapDirectoryEntryToRehberRow);
}