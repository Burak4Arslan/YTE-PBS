import api from '../../api/axiosInstance';

export async function getCustomEnumTypes() {
    const { data } = await api.get('/api/custom-enums');
    return data;
}

export async function getCustomEnumValues(code) {
    const { data } = await api.get(`/api/panel/custom-enums/${code}/values`);
    return data;
}

export async function createCustomEnumValue(code, value, sortOrder = null) {
    const { data } = await api.post(
        `/api/panel/custom-enums/${code}/values`,
        { value, sortOrder }
    );
    return data;
}

export async function createCustomEnumValues(code, values) {
    const { data } = await api.post(
        `/api/panel/custom-enums/${code}/values/bulk`,
        { values }
    );
    return data;
}

export async function updateCustomEnumValue(valueId, value, sortOrder) {
    const { data } = await api.put(
        `/api/panel/custom-enums/values/${valueId}`,
        { value, sortOrder }
    );
    return data;
}

export async function deactivateCustomEnumValue(valueId) {
    await api.delete(`/api/panel/custom-enums/values/${valueId}`);
}

export async function reorderCustomEnumValues(code, valueIds) {
    const { data } = await api.put(
        `/api/panel/custom-enums/${code}/values/order`,
        { valueIds }
    );
    return data;
}
