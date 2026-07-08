"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppBar, Toolbar, Box, Typography, Avatar, IconButton } from "@mui/material";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../api/axiosInstance";

const ALL_NAV_LINKS = [
    { label: "Genel", href: "/", adminOnly: false },
    { label: "Rehber", href: "/rehber", adminOnly: false },
    { label: "Personel", href: "/personel", adminOnly: true },
    { label: "Raporlar", href: "/raporlar", adminOnly: true },
    { label: "Panel", href: "/panel", adminOnly: true },
    { label: "Yetkilendirme", href: "/yetkilendirme", adminOnly: true },
    { label: "Organizasyon Şeması", href: "/organizasyon-semasi", adminOnly: false },
];

export default function TopNav({ userName = "User", avatarUrl = null }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);
    const [currentUser, setCurrentUser] = useState({
        name: userName,
        avatarUrl,
        profileHref: null,
    });

    useEffect(() => {
        queueMicrotask(() => {
            setUserRole(localStorage.getItem("user_role"));
        });
    }, [pathname]);

    useEffect(() => {
        if (pathname === "/login") {
            return;
        }

        let ignore = false;

        const loadCurrentUser = async () => {
            try {
                const [{ data: me }, { data: directory }] = await Promise.all([
                    api.get("/api/personel/hakkımda"),
                    api.get("/api/directory"),
                ]);

                if (ignore) {
                    return;
                }

                const directoryEntry = directory.find(
                    (entry) => entry.email?.toLowerCase() === me.email?.toLowerCase()
                );
                const fullName = [me.firstName, me.lastName].filter(Boolean).join(" ");

                setCurrentUser({
                    name: fullName || me.username || userName,
                    avatarUrl: me.profileImageUrl || avatarUrl,
                    profileHref: directoryEntry ? `/personel/${directoryEntry.id}` : null,
                });
            } catch (error) {
                console.error("Kullanıcı bilgisi yüklenemedi:", error);
                setCurrentUser({
                    name: userName,
                    avatarUrl,
                    profileHref: null,
                });
            }
        };

        loadCurrentUser();

        return () => {
            ignore = true;
        };
    }, [pathname, userName, avatarUrl]);

    if (pathname === "/login") {
        return null;
    }

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("user_role");
            router.push("/login");
        }
    };

    const visibleLinks = ALL_NAV_LINKS.filter(
        (link) => !link.adminOnly || userRole === "ADMIN"
    );

    return (
        <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{ borderBottom: "1px solid", borderBottomColor: "divider" }}
        >
            <Toolbar sx={{ gap: 3, minHeight: 64 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexShrink: 0,
                        width: 351,
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="TÜBİTAK BİLGEM"
                        width={137}
                        height={42}
                        style={{
                            width: "137px",
                            height: "42px",
                            objectFit: "contain",
                        }}
                    />

                    <Box
                        sx={{
                            width: "1px",
                            height: 32,
                            backgroundColor: "divider",
                            flexShrink: 0,
                        }}
                    />

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                        }}
                    >
                        Personel Bilgi Sistemi
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        ml: "auto",
                    }}
                >
                    {visibleLinks.map((link) => {
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

                <Box
                    component={currentUser.profileHref ? Link : "div"}
                    href={currentUser.profileHref || undefined}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        ml: 2,
                        color: "text.primary",
                        textDecoration: "none",
                        cursor: currentUser.profileHref ? "pointer" : "default",
                        "&:hover": currentUser.profileHref
                            ? {
                                color: "primary.main",
                            }
                            : undefined,
                    }}
                >
                    <Avatar src={currentUser.avatarUrl || undefined} sx={{ width: 32, height: 32 }}>
                        {!currentUser.avatarUrl && currentUser.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                        {currentUser.name}
                    </Typography>
                </Box>

                <IconButton size="small" onClick={handleLogout}>
                    <LogoutIcon fontSize="small" />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
