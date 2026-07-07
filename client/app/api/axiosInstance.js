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

// Arka yüzden dönen yanıtları ve hataları küresel olarak yakalayan interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // İstek başarılıysa veriyi hiç bozmadan doğrudan geçir
        return response;
    },
    (error) => {
        // Hata durumunda tetiklenen merkezi alan
        if (error.response) {
            // Sunucu bir hata kodu döndüyse (Örn: 400, 401, 403, 500)
            toast.error(`Hata (${error.response.status}): İşlem gerçekleştirilemedi! ❌`);
        } else if (error.request) {
            // Sunucuya hiç ulaşılamadıysa (Backend kapalıysa veya timeout olduysa)
            toast.error("Hata: Sunucuya bağlanılamadı. Lütfen backend servisini kontrol edin! 🔌");
        } else {
            // İstek kurulurken meydana gelen diğer beklenmeyen hatalar
            toast.error(`Sistemsel Hata: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;