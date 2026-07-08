'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import RoleGuard from '../components/RoleGuard';
import EnumTypeList from './components/EnumTypeList';
import EnumValueList from './components/EnumValueList';
import BulkAddDialog from './components/BulkAddDialog';

import {
    createCustomEnumValue,
    createCustomEnumValues,
    deactivateCustomEnumValue,
    getCustomEnumTypes,
    getCustomEnumValues,
    reorderCustomEnumValues,
    updateCustomEnumValue
} from './services/customEnumService';

export default function PanelPage() {
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [values, setValues] = useState([]);

    const [typesLoading, setTypesLoading] = useState(true);
    const [valuesLoading, setValuesLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bulkAddOpen, setBulkAddOpen] = useState(false);

    const loadValues = useCallback(async (code) => {
        setValuesLoading(true);

        try {
            const loadedValues = await getCustomEnumValues(code);
            setValues(loadedValues);
        } catch (error) {
            console.error('Custom enum değerleri yüklenemedi:', error);
            setValues([]);
        } finally {
            setValuesLoading(false);
        }
    }, []);

    useEffect(() => {
        let ignore = false;

        const loadTypes = async () => {
            try {
                const loadedTypes = await getCustomEnumTypes();
                const orderedTypes = [...loadedTypes].sort(
                    (first, second) => first.sortOrder - second.sortOrder
                );

                if (ignore) {
                    return;
                }

                const firstType = orderedTypes[0] ?? null;

                setTypes(orderedTypes);
                setSelectedType(firstType);

                if (firstType) {
                    setValuesLoading(true);

                    try {
                        const loadedValues = await getCustomEnumValues(firstType.code);

                        if (!ignore) {
                            setValues(loadedValues);
                        }
                    } finally {
                        if (!ignore) {
                            setValuesLoading(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Custom enum alanları yüklenemedi:', error);
            } finally {
                if (!ignore) {
                    setTypesLoading(false);
                }
            }
        };

        loadTypes();

        return () => {
            ignore = true;
        };
    }, []);

    const handleSelectType = async (type) => {
        setBulkAddOpen(false);
        setValues([]);
        setSelectedType(type);
        await loadValues(type.code);
    };

    const handleCreate = async (value) => {
        if (!selectedType) {
            return false;
        }

        setSaving(true);

        try {
            const created = await createCustomEnumValue(
                selectedType.code,
                value
            );

            setValues((currentValues) =>
                [...currentValues, created].sort(
                    (first, second) => first.sortOrder - second.sortOrder
                )
            );

            toast.success('Seçenek başarıyla eklendi.');
            return true;
        } catch (error) {
            console.error('Custom enum değeri eklenemedi:', error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (item, value) => {
        setSaving(true);

        try {
            const updated = await updateCustomEnumValue(
                item.id,
                value,
                item.sortOrder
            );

            setValues((currentValues) =>
                currentValues
                    .map((currentItem) =>
                        currentItem.id === updated.id ? updated : currentItem
                    )
                    .sort(
                        (first, second) =>
                            first.sortOrder - second.sortOrder
                    )
            );

            toast.success('Seçenek başarıyla güncellendi.');
            return true;
        } catch (error) {
            console.error('Custom enum değeri güncellenemedi:', error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (item) => {
        const confirmed = window.confirm(
            `"${item.value}" seçeneğini pasife almak istediğinize emin misiniz?`
        );

        if (!confirmed) {
            return;
        }

        setSaving(true);

        try {
            await deactivateCustomEnumValue(item.id);

            setValues((currentValues) =>
                currentValues.map((currentItem) =>
                    currentItem.id === item.id
                        ? { ...currentItem, active: false }
                        : currentItem
                )
            );

            toast.success('Seçenek pasife alındı.');
        } catch (error) {
            console.error('Custom enum değeri pasife alınamadı:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleMove = async (currentIndex, direction) => {
        if (!selectedType) {
            return;
        }

        const targetIndex = currentIndex + direction;

        if (targetIndex < 0 || targetIndex >= values.length) {
            return;
        }

        const previousValues = values;
        const reorderedValues = [...values];

        [reorderedValues[currentIndex], reorderedValues[targetIndex]] = [
            reorderedValues[targetIndex],
            reorderedValues[currentIndex]
        ];

        setValues(reorderedValues);
        setSaving(true);

        try {
            const savedValues = await reorderCustomEnumValues(
                selectedType.code,
                reorderedValues.map((item) => item.id)
            );

            setValues(savedValues);
        } catch (error) {
            console.error('Custom enum sıralaması kaydedilemedi:', error);
            setValues(previousValues);
        } finally {
            setSaving(false);
        }
    };

    const handleBulkAdd = async (newValues) => {
        if (!selectedType) {
            return false;
        }

        setSaving(true);

        try {
            const createdValues = await createCustomEnumValues(
                selectedType.code,
                newValues
            );

            await loadValues(selectedType.code);

            toast.success(
                `${createdValues.length} seçenek başarıyla eklendi.`
            );

            return true;
        } catch (error) {
            console.error('Custom enum değerleri toplu eklenemedi:', error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <Box
                sx={{
                    maxWidth: 1280,
                    mx: 'auto',
                    px: { xs: 2, md: 3 },
                    py: 4
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 0.5
                        }}
                    >
                        Yönetim Paneli
                    </Typography>

                    <Typography color="text.secondary">
                        Sistemde kullanılan alanları ve seçeneklerini yönetin.
                    </Typography>
                </Box>

                {typesLoading ? (
                    <Paper
                        variant="outlined"
                        sx={{
                            minHeight: 420,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <CircularProgress />
                    </Paper>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '300px minmax(0, 1fr)'
                            },
                            gap: 3,
                            alignItems: 'start'
                        }}
                    >
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                position: { md: 'sticky' },
                                top: { md: 16 }
                            }}
                        >
                            <EnumTypeList
                                types={types}
                                selectedCode={selectedType?.code}
                                onSelect={handleSelectType}
                                loading={false}
                            />
                        </Paper>

                        <EnumValueList
                            key={selectedType?.code ?? 'no-selection'}
                            selectedType={selectedType}
                            values={values}
                            loading={valuesLoading}
                            saving={saving}
                            onCreate={handleCreate}
                            onUpdate={handleUpdate}
                            onDeactivate={handleDeactivate}
                            onMove={handleMove}
                            onOpenBulkAdd={() => setBulkAddOpen(true)}
                        />
                    </Box>
                )}

                <BulkAddDialog
                    key={selectedType?.code ?? 'bulk-no-selection'}
                    open={bulkAddOpen}
                    fieldName={selectedType?.displayName}
                    saving={saving}
                    onClose={() => setBulkAddOpen(false)}
                    onSubmit={handleBulkAdd}
                />
            </Box>
        </RoleGuard>
    );
}
