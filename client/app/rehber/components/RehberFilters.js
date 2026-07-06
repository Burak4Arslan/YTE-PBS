"use client";

import { Box, TextField, InputAdornment, Select, MenuItem, FormControl, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const FILTER_FIELDS = [
    { key: "unvan", label: "Unvan" },
    { key: "gorev", label: "Görev" },
    { key: "birim", label: "Birim" },
    { key: "proje", label: "Proje" },
    { key: "katki", label: "Katkı" },
    { key: "takim", label: "Takım" },
];

export default function RehberFilters({ filters, onFilterChange, onSearch, onAddPersonel }) {
    return (
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap", mb: 3 }}>
            <TextField
                placeholder="İsim Soyisim"
                size="small"
                value={filters.isimSoyisim || ""}
                onChange={(e) => onFilterChange("isimSoyisim", e.target.value)}
                sx={{ minWidth: 200 }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            {FILTER_FIELDS.map((field) => (
                <FormControl key={field.key} size="small" sx={{ minWidth: 130 }}>
                    <Select
                        displayEmpty
                        value={filters[field.key] || ""}
                        onChange={(e) => onFilterChange(field.key, e.target.value)}
                    >
                        <MenuItem value="">{field.label}</MenuItem>
                    </Select>
                </FormControl>
            ))}

            <Button variant="contained" color="warning" onClick={onSearch} sx={{ ml: "auto", whiteSpace: "nowrap" }}>
                SORGULA
            </Button>

            <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={onAddPersonel}
                sx={{ whiteSpace: "nowrap" }}
            >
                PERSONEL EKLE
            </Button>
        </Box>
    );
}
