"use client";
import { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";
import { Grid, Card, CardContent, Typography, Avatar, Box, CircularProgress } from "@mui/material";
import AttendanceCard from "./personel/components/AttendanceCard";
import RehberView from "@/app/rehber/rehberView";
import RoleGuard from "./components/RoleGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Home() {
    const [news, setNews] = useState([]);
    const [events, setEvents] = useState([]);
    const [latestPersonnel, setLatestPersonnel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, eventsRes, latestPersonnelRes] = await Promise.all([
                    axiosInstance.get("/api/news"),
                    axiosInstance.get("/api/events"),
                    axiosInstance.get("/api/personnel/latest")
                ]);
                if (newsRes && newsRes.data) setNews(newsRes.data);
                if (eventsRes && eventsRes.data) setEvents(eventsRes.data);
                if (latestPersonnelRes && latestPersonnelRes.data) setLatestPersonnel(latestPersonnelRes.data);
            } catch (error) {
                console.error("Veriler çekilirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const currentMonth = new Date().getMonth();
    const birthdays = events.filter(e => {
        if (e.eventType !== "BIRTHDAY") return false;
        if (!e.eventDate) return false;
        const eventMonth = new Date(e.eventDate).getMonth();
        return eventMonth === currentMonth;
    });

    const isLatestPersonnelThisMonth = latestPersonnel && latestPersonnel.hireDate 
        ? new Date(latestPersonnel.hireDate).getMonth() === currentMonth 
        : false;

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <RoleGuard allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
        <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Grid container spacing={2}>

                <Grid size={{ xs: 12, md: 12 }}>
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                            borderBottom: "4px solid #d32f2f",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",

                            "& button": {
                                '&:has(text:contains("Personel Ekle")), &:contains("Personel Ekle"), &[title*="Personel Ekle"]': {
                                    display: "none !important"
                                }
                            },
                            "& .MuiButton-root:nth-of-type(2)": {
                                display: "none !important"
                            }
                        }}
                    >
                        <Box
                            sx={{
                                maxHeight: "45vh",
                                overflowY: "auto",
                                width: "100%"
                            }}
                        >
                            <RehberView />
                        </Box>
                    </Box>
                </Grid>

                {/* 1. KART: HABERLER */}
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                    <Card
                        sx={{
                            width: "100%",
                            backgroundColor: "#0b192c",
                            color: "white",
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            borderBottom: "4px solid #d32f2f" // Diğer kartlarla aynı alt kırmızı çizgi eklendi
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#e0e0e0', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    📰 HABERLER
                                </Typography>

                                {news.length > 0 ? (
                                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                                        <Box
                                            component="img"
                                            src={news[currentNewsIndex]?.imageUrl || "https://via.placeholder.com/600x300?text=Haber+Görseli"}
                                            sx={{ width: "100%", height: 180, objectFit: "cover", opacity: 0.7 }}
                                        />
                                        <Box sx={{ position: 'absolute', bottom: 15, left: 15, right: 15 }}>
                                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                                                {news[currentNewsIndex]?.content}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>Henüz haber bulunmuyor.</Typography>
                                )}
                            </Box>

                            {news.length > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 2 }}>
                                    <button
                                        onClick={() => setCurrentNewsIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1))}
                                        style={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        &lt;
                                    </button>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {news.map((_, index) => (
                                            <Box key={index} sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: currentNewsIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.3)' }} />
                                        ))}
                                    </Box>
                                    <button
                                        onClick={() => setCurrentNewsIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1))}
                                        style={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        &gt;
                                    </button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. KART: BU AY DOĞANLAR  */}
                <Grid size={{ xs: 12, md: 2.6 }} sx={{ display: 'flex' }}>
                    <Card sx={{ width: "100%", borderRadius: 2, borderBottom: "4px solid #d32f2f", display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ textAlign: "center", pt: 2, pb: 2, px: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, fontSize: '0.8rem' }}>
                                🎂 BU AY DOĞANLAR
                            </Typography>

                            {birthdays.length > 0 ? birthdays.slice(0, 1).map((person) => (
                                <Box key={person.id}>
                                    <Avatar
                                        src={person.profileImageUrl}
                                        sx={{ width: 70, height: 70, mx: "auto", mb: 1 }}
                                    />
                                    <Typography variant="caption" color="textSecondary" display="block">İyi Ki Doğdun!</Typography>
                                    <Typography variant="body2" color="error" fontWeight="bold">
                                        {person.fullName}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 0.5 }}>
                                        Nice mutlu, sağlıklı günler dileriz.
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                                        {formatDate(person.eventDate)}
                                    </Typography>
                                </Box>
                            )) : (
                                <Typography variant="body2" color="textSecondary">Bu ay doğum günü yok.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. KART: ARAMIZA HOŞGELDİN  */}
                <Grid size={{ xs: 12, md: 2.6 }} sx={{ display: 'flex' }}>
                    <Card sx={{ width: "100%", borderRadius: 2, borderBottom: "4px solid #d32f2f", display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ textAlign: "center", pt: 2, pb: 2, px: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, fontSize: '0.8rem' }}>
                                👤 ARAMIZA HOŞGELDİN
                            </Typography>

                            {isLatestPersonnelThisMonth ? (
                                <Box key={latestPersonnel.id}>
                                    <Avatar
                                        src={latestPersonnel.photoUrl || undefined}
                                        sx={{ width: 70, height: 70, mx: "auto", mb: 1 }}
                                    />
                                    <Typography variant="caption" color="textSecondary" display="block">Hoşgeldin!</Typography>
                                    <Typography variant="body2" color="error" fontWeight="bold">
                                        {[latestPersonnel.firstName, latestPersonnel.lastName].filter(Boolean).join(" ")}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 0.5 }}>
                                        Seninle daha güçlüyüz!
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                                        {formatDate(latestPersonnel.hireDate)}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="textSecondary">Bu ay yeni katılan personel yok.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 4. KART: MTS / ATTENDANCE CARD  */}
                <Grid size={{ xs: 12, md: 2.8 }} sx={{ display: 'flex' }}>
                    <Box
                        sx={{
                            width: "100%",
                            display: 'flex',
                            flexDirection: 'column',
                            "& > *": { height: "100%", flex: 1 }
                        }}
                    >
                        <AttendanceCard />
                    </Box>
                </Grid>
            </Grid>
        </Box>
        </RoleGuard>
    );
}