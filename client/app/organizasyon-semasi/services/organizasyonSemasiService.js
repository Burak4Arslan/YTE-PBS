import axiosInstance from "../../api/axiosInstance";

/**
 * GET /api/personnel-hierarchy
 * Backend PersonnelHierarchyDto alanlarıyla (id, userId, personnelName,
 * personnelSurname, personnelJobTitle, superiorPersonnelId) birebir aynı
 * isimlerle dönüyor; PersonnelNode component'i de bu isimleri bekliyor,
 * bu yüzden ekstra bir alan eşleme fonksiyonuna gerek yok. Backend henüz
 * fotoğraf alanı döndürmediği için avatarUrl'i burada null olarak ekliyoruz.
 */
export async function fetchPersonnelHierarchy() {
    const response = await axiosInstance.get("/api/personnel-hierarchy");
    return response.data.map((entry) => ({ ...entry, avatarUrl: null }));
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