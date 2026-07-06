import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../theme/ThemeRegistry";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className={roboto.className}>
        <body>
        <ThemeRegistry>{children}</ThemeRegistry>
        </body>
        </html>
    );
}