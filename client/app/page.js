"use client";

import { Button, Stack } from "@mui/material";

export default function Home() {
    return (
        <Stack direction="row" spacing={2} sx={{ padding: 4 }}>
            <Button variant="contained" color="primary">
                Primary
            </Button>
            <Button variant="contained" color="secondary">
                Secondary
            </Button>
            <Button variant="contained" color="warning">
                Sorgula
            </Button>
        </Stack>
    );
}