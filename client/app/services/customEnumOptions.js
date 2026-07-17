import api from '../api/axiosInstance';

export async function getCustomEnumOptionValues(code) {
    const { data } = await api.get(`/api/custom-enums/${code}/values`);

    return (data || []).map((item) => item.value);
}

export async function getCustomEnumOptionMap(codes) {
    const entries = await Promise.all(
        codes.map(async (code) => [code, await getCustomEnumOptionValues(code)])
    );

    return Object.fromEntries(entries);
}
