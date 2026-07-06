"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#EC1E24", // red login button
        },
        secondary: {
            main: "#2E7D32", // green buttons
        },
        warning: {
            main: "#ED6C02", // orange button
        },
        background: {
            default: "#F5F5F5",
            paper: "#FFFFFF",
        },
    },
    typography: {
        fontFamily: "'Roboto', Arial, sans-serif",
    },
    shape: {
        borderRadius: 6, // replace with exact value from Figma
    },
});

export default theme;