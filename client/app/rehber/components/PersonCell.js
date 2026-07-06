"use client";

import { Avatar, Box, Typography } from "@mui/material";

export default function PersonCell({ adSoyad, avatarUrl }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, height: "100%" }}>
            <Avatar src={avatarUrl || undefined} sx={{ width: 32, height: 32, bgcolor: "grey.300" }}>
                {!avatarUrl && adSoyad?.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {adSoyad}
            </Typography>
        </Box>
    );
}
