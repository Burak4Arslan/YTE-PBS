"use client";

import { Avatar, Box, Typography } from "@mui/material";

export default function PersonnelNode({ personnelName, personnelSurname, personnelJobTitle, avatarUrl }) {
    const fullName = [personnelName, personnelSurname].filter(Boolean).join(" ");

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 1.5
            }}
        >
            <Avatar
                src={avatarUrl || undefined}
                alt={fullName}
                sx={{ width: 48, height: 48, bgcolor: "grey.300" }}
            >
                {!avatarUrl && personnelName?.charAt(0)}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {personnelJobTitle}
                </Typography>
                <Typography variant="body1" color="text.primary" fontWeight={700}>
                    {fullName}
                </Typography>
            </Box>
        </Box>
    );
}