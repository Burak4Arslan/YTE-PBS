'use client';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    CircularProgress,
    List,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CATEGORY_LABELS = {
    GENERAL: 'Genel',
    EDUCATION: 'Eğitim',
    CONTRIBUTION: 'Katkılar',
    FILE: 'Dosya'
};

const CATEGORY_ORDER = [
    'GENERAL',
    'EDUCATION',
    'CONTRIBUTION',
    'FILE'
];

const NON_ENUM_FIELDS = [
    {
        id: 'project-field',
        code: 'PROJECT_FIELD',
        displayName: 'Çalışılan Proje',
        category: 'GENERAL',
        sortOrder: 5.5,
        editable: false
    },
];

export default function EnumTypeList({
    types,
    selectedCode,
    onSelect,
    loading
}) {
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 5
                }}
            >
                <CircularProgress size={28} />
            </Box>
        );
    }

    const allFields = [
        ...types.map((type) => ({ ...type, editable: true })),
        ...NON_ENUM_FIELDS
    ];

    const groupedTypes = CATEGORY_ORDER.map((category) => ({
        category,
        label: CATEGORY_LABELS[category],
        types: allFields
            .filter((type) => type.category === category)
            .sort((a, b) => a.sortOrder - b.sortOrder)
    })).filter((group) => group.types.length > 0);

    return (
        <Box>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2
                }}
            >
                Alanlar
            </Typography>

            {groupedTypes.map((group) => (
                <Accordion
                    key={group.category}
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 1.5,
                        borderRadius: '6px !important',
                        overflow: 'hidden',
                        '&::before': {
                            display: 'none'
                        }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: 48,
                            backgroundColor: '#F7F7F7',
                            '& .MuiAccordionSummary-content': {
                                my: 1
                            }
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.95rem'
                            }}
                        >
                            {group.label}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 0 }}>
                        <List disablePadding>
                            {group.types.map((type) => {
                                const selected = type.code === selectedCode;

                                return (
                                    <ListItemButton
                                        key={type.code}
                                        selected={selected}
                                        onClick={() => onSelect(type)}
                                        sx={{
                                            px: 2.5,
                                            py: 1,
                                            borderLeft: '3px solid transparent',
                                            '&.Mui-selected': {
                                                backgroundColor: '#FFF1F1',
                                                borderLeftColor: 'primary.main',
                                                color: 'primary.main'
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: '#FFE7E7'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={type.displayName}
                                            slotProps={{
                                                primary: {
                                                    sx: {
                                                        fontSize: '0.9rem',
                                                        fontWeight: selected ? 700 : 400
                                                    }
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
