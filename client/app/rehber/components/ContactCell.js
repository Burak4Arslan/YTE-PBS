"use client";

import { Box, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export function EmailCell({ ePosta }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, height: "100%" }}>
            <EmailIcon sx={{ fontSize: 16, color: "primary.main" }} />
            <Typography variant="body2">{ePosta}</Typography>
        </Box>
    );
}

export function PhoneCell({ telefon }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, height: "100%" }}>
            <PhoneIcon sx={{ fontSize: 16, color: "primary.main" }} />
            <Typography variant="body2">{telefon}</Typography>
        </Box>
    );
}
