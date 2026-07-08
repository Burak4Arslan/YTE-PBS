import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const currentUrl = error.config?.url || '';

        // KRİTİK İSTİSNA: Kullanıcı zaten login sayfasındayken yanlış şifre girip 401/403 yiyorsa
        // onu tekrar login'e şutlayıp sonsuz döngüye sokmuyoruz.
        const isLoginRequest = currentUrl.includes('/api/auth/login');

        // 1. Network / Sunucu Kapalı Hatası (response objesi hiç yoksa)
        if (!error.response) {
            toast.error("Hata: Sunucuya bağlanılamadı. Lütfen backend servisini kontrol edin! 🔌");
            return Promise.reject(error);
        }

        const status = error.response.status;

        // 2. Yetkisiz Erişim ve Oturum Sonlanma Yönetimi (401 + 403)
        //    Spring Security oturum yokken 401, yetki yokken 403 döner — ikisini de yakala
        if ((status === 401 || status === 403) && !isLoginRequest) {
            toast.error("Oturumunuz sonlandı veya bu sayfaya erişim yetkiniz yok! Giriş sayfasına yönlendiriliyorsunuz... 🔒");

            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }, 2000); // 2 saniye toast okunsun diye bekletiyoruz

            return Promise.reject(error);
        }

        // 3. Custom enum çakışmaları
        const isCustomEnumRequest =
            currentUrl.includes('/api/panel/custom-enums');

        if (status === 409 && isCustomEnumRequest) {
            const backendMessage =
                error.response.data?.message ||
                error.response.data?.detail ||
                'Bu seçenek zaten mevcut.';

            toast.warning(backendMessage);
            return Promise.reject(error);
        }

        // 4. Diğer genel hatalar
        if (!isLoginRequest) {
            toast.error(`Hata (${status}): İşlem gerçekleştirilemedi! ❌`);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;