"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography, IconButton, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import PersonCell from "./components/PersonCell";
import GorevCell from "./components/GorevCell";
import { EmailCell, PhoneCell } from "./components/ContactCell";
import RehberFilters from "./components/RehberFilters";
import { fetchRehberList, fetchTitles, fetchDuties, fetchUnits, fetchProjects } from "./services/rehberService";

import RehberDetayModal from "./components/RehberDetayModal";

export default function RehberView() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [options, setOptions] = useState({ unvan: [], gorev: [], birim: [], proje: [] });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPersonelId, setSelectedPersonelId] = useState(null);

    // Sayfa ilk açıldığında backend'den veriyi çek ve seçenekleri yükle.
    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                const [data, titles, duties, units, projects] = await Promise.all([
                    fetchRehberList(),
                    fetchTitles(),
                    fetchDuties(),
                    fetchUnits(),
                    fetchProjects()
                ]);

                if (isMounted) {
                    setRows(data);
                    setOptions({
                        unvan: titles,
                        gorev: duties,
                        birim: units,
                        proje: projects
                    });
                }
            } catch (err) {
                console.error("Rehber verisi alınamadı:", err);
                if (isMounted) setError("Personel listesi yüklenemedi. Backend'in çalıştığından emin olun.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSearchWith = async (currentFilters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRehberList(currentFilters);
            setRows(data);
        } catch (err) {
            console.error("Rehber araması başarısız:", err);
            setError("Arama sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const newFilters = { ...prev, [key]: value };
            if (value === "") {
                handleSearchWith(newFilters);
            }
            return newFilters;
        });
    };

    const handleSearch = () => handleSearchWith(filters);

    const handleOpenDetail = (id) => {
        setSelectedPersonelId(id);
        setIsModalOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                field: "adSoyad",
                headerName: "Ad Soyad",
                flex: 1.4,
                minWidth: 180,
                renderCell: (params) => <PersonCell adSoyad={params.row.adSoyad} avatarUrl={params.row.avatarUrl} />,
            },
            {
                field: "birim",
                headerName: "Birim",
                flex: 1.6,
                minWidth: 200,
            },
            {
                field: "unvan",
                headerName: "Unvan",
                flex: 1,
                minWidth: 140,
            },
            {
                field: "gorevler",
                headerName: "Görev",
                flex: 1.5,
                minWidth: 200,
                sortable: false,
                renderCell: (params) => <GorevCell gorevler={params.row.gorevler} />,
            },
            {
                field: "ePosta",
                headerName: "E-Posta",
                flex: 1.4,
                minWidth: 190,
                renderCell: (params) => <EmailCell ePosta={params.row.ePosta} />,
            },
            {
                field: "telefon",
                headerName: "Telefon",
                flex: 1.1,
                minWidth: 150,
                renderCell: (params) => <PhoneCell telefon={params.row.telefon} />,
            },
            {
                field: "actions",
                headerName: "",
                width: 56,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                renderCell: (params) => (
                    <IconButton
                        size="small"
                        onClick={() => handleOpenDetail(params.row.id)} // Satırın id değerini gönderiyoruz
                    >
                        <OpenInFullIcon fontSize="small" />
                    </IconButton>
                ),
            },
        ],
        []
    );

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                borderBottom: "4px solid",
                borderBottomColor: "primary.main",
                p: 3,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <img src="/rehber.png" alt="Rehber" style={{ width: 24, height: 24 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    REHBER
                </Typography>
            </Box>

            <RehberFilters
                filters={filters}
                options={options}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onAddPersonel={() => {
                    router.push('/personel/ekle');
                }}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                loading={loading}
                getRowHeight={() => 64}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "grey.50",
                        borderBottom: "2px solid",
                        borderBottomColor: "divider",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 600,
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid",
                        borderBottomColor: "divider",
                    },
                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                        outline: "none",
                    },
                }}
            />

            {/* REHBER DETAY MODALI */}
            <RehberDetayModal
                personelId={selectedPersonelId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Paper>
    );
}