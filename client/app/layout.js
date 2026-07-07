import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../theme/ThemeRegistry";

// React Toastify kütüphanesini ve şık CSS tasarımlarını içeri alıyoruz
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className={roboto.className}>
            <body>
                <ThemeRegistry>
                    <TopNav />
                    {children}
                </ThemeRegistry>

                {/* Görseldeki gibi renkli temada (colored) ve sağ üstte fırlayacak küresel konteyner */}
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </body>
        </html>
    );
}
