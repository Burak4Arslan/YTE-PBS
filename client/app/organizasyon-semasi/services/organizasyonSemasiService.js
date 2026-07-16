import axiosInstance from "../../api/axiosInstance";

/**
 * GET /api/personnel-hierarchy
 * Backend PersonnelHierarchyDto alanlarıyla (id, userId, personnelName,
 * personnelSurname, personnelJobTitle, department, photoUrl, superiorPersonnelId)
 * birebir aynı isimlerle dönüyor; PersonnelNode component'i de bu isimleri
 * bekliyor, bu yüzden ekstra bir alan eşleme fonksiyonuna gerek yok. photoUrl'i
 * component'in beklediği avatarUrl ismine burada eşliyoruz.
 */
export async function fetchPersonnelHierarchy() {
    const response = await axiosInstance.get("/api/personnel-hierarchy");
    return response.data.map((entry) => ({ ...entry, avatarUrl: entry.photoUrl || null }));
}

/**
 * GET /api/directory
 * Hiyerarşi düğümlerini Rehber'deki kayıtlarla eşleştirebilmek için (iki tablo
 * arasında ortak bir id yok) ad-soyad üzerinden bir eşleme haritası kuruyoruz.
 */
export async function fetchDirectoryIdByFullName() {
    const response = await axiosInstance.get("/api/directory");
    const map = new Map();
    response.data.forEach((entry) => {
        const key = (entry.fullName || "").trim().toLowerCase();
        if (key) map.set(key, entry.id);
    });
    return map;
}

/**
 * Flat listeyi (her satır kendi id'sini ve superiorPersonnelId'sini taşır)
 * PersonnelSectionCard'ın çizebileceği bir ağaca çevirir. Üstü olmayanlar
 * (superiorPersonnelId: null) ağacın kökleridir.
 */
export function buildPersonnelHierarchyTree(personnelList) {
    const nodesById = new Map(
        personnelList.map((personnel) => [personnel.id, { ...personnel, children: [] }])
    );

    const roots = [];
    nodesById.forEach((node) => {
        if (node.superiorPersonnelId != null && nodesById.has(node.superiorPersonnelId)) {
            nodesById.get(node.superiorPersonnelId).children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}