import { Box, Card, CardContent, Typography } from '@mui/material';

export default function PersonnelSectionCard({ icon, title, action, children }) {
    return (
        <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', borderBottom: '5px solid', borderBottomColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
                    </Box>
                    {action}
                </Box>
                {children}
            </CardContent>
        </Card>
    );
}
