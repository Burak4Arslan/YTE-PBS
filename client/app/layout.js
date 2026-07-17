import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../theme/ThemeRegistry";
import TopNav from "./components/TopNav";
import TenureBanner from "./components/TenureBanner";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata = {
  title: 'YTE Personel Bilgi Sistemi',
  description: 'TÜBİTAK BİLGEM YTE Personel Bilgi Sistemi',
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className={roboto.className}>
        <body>
        <ThemeRegistry>
            <TopNav />
            <TenureBanner />
            {children}
        </ThemeRegistry>

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
