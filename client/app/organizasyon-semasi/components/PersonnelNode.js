"use client";

import { Avatar, Box, Typography } from "@mui/material";

export default function PersonnelNode({ personnelName, personnelSurname, personnelJobTitle, avatarUrl }) {
    const fullName = [personnelName, personnelSurname].filter(Boolean).join(" ");

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                minWidth: 260,
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.8) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: 4,
                p: 2,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0,0,0,0.02)",
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                    transform: "translateY(-3px) scale(1.02)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0,0,0,0.03)",
                    borderColor: "primary.light",
                    "& .node-avatar": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                        transform: "scale(1.05)"
                    }
                },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    background: "linear-gradient(to bottom, #1976d2, #64b5f6)",
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                }
            }}
        >
            <Avatar
                className="node-avatar"
                src={avatarUrl || undefined}
                alt={fullName}
                sx={{ 
                    width: 56, 
                    height: 56, 
                    bgcolor: "primary.main",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >
                {!avatarUrl && personnelName?.charAt(0)}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: "primary.main", 
                        fontWeight: 700, 
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        mb: 0.5
                    }}
                >
                    {personnelJobTitle}
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: "text.primary", 
                        fontWeight: 700,
                        lineHeight: 1.2
                    }}
                >
                    {fullName}
                </Typography>
            </Box>
        </Box>
    );
}