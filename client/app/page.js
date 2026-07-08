"use client";
import { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";
import { Grid, Card, CardContent, Typography, Avatar, Box, CircularProgress } from "@mui/material";
import AttendanceCard from "./personel/components/AttendanceCard";

// .env dosyasındaki URL'yi alıyoruz, yoksa yedeği kullanıyoruz
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Home() {
    const [news, setNews] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0); // Haber geçişleri için index durumu

    useEffect(() => {
        const fetchData = async () => {
            try {
                // İstekleri atıyoruz
                const [newsRes, eventsRes] = await Promise.all([
                    axiosInstance.get("/api/news"),
                    axiosInstance.get("/api/events")
                ]);

                // Veriler başarıyla gelirse state'leri güncelle
                if (newsRes && newsRes.data) setNews(newsRes.data);
                if (eventsRes && eventsRes.data) setEvents(eventsRes.data);
            } catch (error) {
                // Hata interceptor tarafından yakalanıp toast basılacak, konsola da yazalım
                console.error("Veriler çekilirken hata oluştu:", error);
            } finally {
                // Ne olursa olsun yükleniyor ekranını kapat ki sayfa açılsın
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Gelen etkinlikleri tiplerine göre ayırıyoruz
    const birthdays = events.filter(e => e.eventType === "BIRTHDAY");
    const welcomes = events.filter(e => e.eventType === "WELCOME");

    // "2026-06-10" formatını "10 Haziran" formatına çeviren yardımcı fonksiyon
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
        <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Grid container spacing={3}>

                {/* 1. KART: HABERLER (Geniş alan kaplar) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: "100%", backgroundColor: "#0b192c", color: "white", borderRadius: 2 }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#e0e0e0' }}>
                                    📰 HABERLER
                                </Typography>

                                {news.length > 0 ? (
                                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                                        {/* Aktif indexteki haberi dinamik olarak gösteriyoruz */}
                                        <Box
                                            component="img"
                                            src={news[currentNewsIndex]?.imageUrl || "https://via.placeholder.com/600x300?text=Haber+Görseli"}
                                            sx={{ width: "100%", height: 300, objectFit: "cover", opacity: 0.7 }}
                                        />
                                        <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {news[currentNewsIndex]?.content}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography sx={{ mt: 4, textAlign: 'center' }}>Henüz haber bulunmuyor.</Typography>
                                )}
                            </Box>

                            {/* Figma Tasarımındaki Geçiş Okları ve Sayfalama Noktaları */}
                            {/* Figma Tasarımındaki Geçiş Okları ve Sayfalama Noktaları - ORTALANMIŞ HALİ */}
                            {news.length > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, gap: 2 }}>

                                    {/* Sol Ok (<) */}
                                    <button
                                        onClick={() => setCurrentNewsIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1))}
                                        style={{
                                            color: '#fff',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                                    >
                                        &lt;
                                    </button>

                                    {/* Ortadaki Sayfalama Noktaları */}
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {news.map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: currentNewsIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    {/* Sağ Ok (>) */}
                                    <button
                                        onClick={() => setCurrentNewsIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1))}
                                        style={{
                                            color: '#fff',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                                    >
                                        &gt;
                                    </button>

                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. KART: BU AY DOĞANLAR */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ height: "100%", borderRadius: 2, borderTop: "4px solid #d32f2f" }}>
                        <CardContent sx={{ textAlign: "center", pt: 3 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                🎂 BU AY DOĞANLAR
                            </Typography>

                            {birthdays.length > 0 ? birthdays.map((person) => (
                                <Box key={person.id} sx={{ mb: 3 }}>
                                    <Avatar
                                        src={person.profileImageUrl}
                                        sx={{ width: 90, height: 90, mx: "auto", mb: 2 }}
                                    />
                                    <Typography variant="body1" fontWeight="bold">İyi Ki Doğdun!</Typography>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        {person.fullName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
                                        Nice mutlu, sağlıklı günler dileriz.
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {formatDate(person.eventDate)}
                                    </Typography>
                                </Box>
                            )) : (
                                <Typography color="textSecondary" sx={{ mt: 4 }}>Bu ay doğum günü yok.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. KART: ARAMIZA HOŞGELDİN */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ height: "100%", borderRadius: 2, borderTop: "4px solid #d32f2f" }}>
                        <CardContent sx={{ textAlign: "center", pt: 3 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                👤 ARAMIZA HOŞGELDİN
                            </Typography>

                            {welcomes.length > 0 ? welcomes.map((person) => (
                                <Box key={person.id} sx={{ mb: 3 }}>
                                    <Avatar
                                        src={person.profileImageUrl}
                                        sx={{ width: 90, height: 90, mx: "auto", mb: 2 }}
                                    />
                                    <Typography variant="body1" fontWeight="bold">Hoşgeldin!</Typography>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        {person.fullName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
                                        Seninle daha güçlüyüz!
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {formatDate(person.eventDate)}
                                    </Typography>
                                </Box>
                            )) : (
                                <Typography color="textSecondary" sx={{ mt: 4 }}>Yeni katılan personel yok.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }} sx={{ ml: { md: 'auto' } }}>
                    <AttendanceCard />
                </Grid>

            </Grid>
        </Box>
    );
}
