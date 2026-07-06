"use client";

import { Box, Typography } from "@mui/material";

export default function GorevCell({ gorevler = [] }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", py: 1 }}>
            {gorevler.map((gorev, index) => (
                <Typography
                    key={index}
                    variant="body2"
                    color={index === 0 ? "text.primary" : "text.secondary"}
                    sx={{ lineHeight: 1.4 }}
                >
                    {gorev}
                </Typography>
            ))}
        </Box>
    );
}
