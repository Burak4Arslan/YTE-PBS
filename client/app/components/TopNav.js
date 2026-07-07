"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppBar, Toolbar, Box, Typography, Avatar, IconButton } from "@mui/material";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../api/axiosInstance";

const NAV_LINKS = [
    { label: "Genel", href: "/" },
    { label: "Rehber", href: "/rehber" },
    { label: "Raporlar", href: "/raporlar" },
    { label: "Panel", href: "/panel" },
    { label: "Yetkilendirme", href: "/yetkilendirme" },
    { label: "Organizasyon Şeması", href: "/organizasyon-semasi" },
];

export default function TopNav({ userName = "User", avatarUrl = null }) {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/login") {
        return null;
    }

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            router.push("/login");
        }
    };

    return (
        <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{ borderBottom: "1px solid", borderBottomColor: "divider" }}
        >
            <Toolbar sx={{ gap: 3, minHeight: 64 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Image src="/logo.png" alt="BİLGEM" width={36} height={36} />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    Personel Bilgi Sistemi
                </Typography>

                <Box sx={{ display: "flex", gap: 3, ml: 4, flexGrow: 1 }}>
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Typography
                                key={link.href}
                                component={Link}
                                href={link.href}
                                variant="body2"
                                sx={{
                                    textDecoration: "none",
                                    color: isActive ? "primary.main" : "text.primary",
                                    fontWeight: isActive ? 600 : 400,
                                    whiteSpace: "nowrap",
                                    "&:hover": { color: "primary.main" },
                                }}
                            >
                                {link.label}
                            </Typography>
                        );
                    })}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src={avatarUrl || undefined} sx={{ width: 32, height: 32 }}>
                        {!avatarUrl && userName.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                        {userName}
                    </Typography>
                </Box>

                <IconButton size="small" onClick={handleLogout}>
                    <LogoutIcon fontSize="small" />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}