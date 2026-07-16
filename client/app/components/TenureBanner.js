"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Typography } from "@mui/material";
import api from "../api/axiosInstance";

const calculateTenure = (startDateStr) => {
    if (!startDateStr) return null;

    const start = new Date(startDateStr);
    if (Number.isNaN(start.getTime())) return null;

    const now = new Date();
    if (start > now) return null;

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
};

export default function TenureBanner() {
    const pathname = usePathname();
    const [tenure, setTenure] = useState(null);
    const [hasStoredRole, setHasStoredRole] = useState(false);

    useEffect(() => {
        if (pathname === "/login") {
            setHasStoredRole(false);
            return;
        }

        const storedRole = localStorage.getItem("user_role");
        const hasRole = Boolean(storedRole);

        setHasStoredRole(hasRole);

        if (!hasRole) {
            setTenure(null);
            return;
        }

        let ignore = false;

        const loadTenure = async () => {
            try {
                const { data: me } = await api.get("/api/personel/hakkımda");
                if (ignore) return;
                setTenure(calculateTenure(me.employmentStartDate || me.hireDate));
            } catch (error) {
                console.error("Kıdem bilgisi yüklenemedi:", error);
                if (!ignore) setTenure(null);
            }
        };

        loadTenure();

        return () => {
            ignore = true;
        };
    }, [pathname]);

    if (pathname === "/login" || !hasStoredRole) {
        return null;
    }

    return (
        <Box
            sx={{
                backgroundColor: "#d32f2f",
                color: "#fff",
                px: 3,
                py: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 0.75,
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                {tenure
                    ? `${tenure.years} Yıl ${tenure.months} Ay ${tenure.days} Gün'dür birlikteyiz.`
                    : "İşe giriş tarihi bulunamadı"}
            </Typography>

        </Box>
    );
}