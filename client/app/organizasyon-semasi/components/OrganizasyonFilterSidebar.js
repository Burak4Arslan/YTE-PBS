'use client';

import { useState } from 'react';
import {
    Box,
    Collapse,
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const panelSx = {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: 'background.paper',
    overflow: 'hidden'
};

function FilterList({ title, items, selected, onSelect, collapsible = true }) {
    const [open, setOpen] = useState(true);

    return (
        <Box sx={panelSx}>
            <Box
                onClick={collapsible ? () => setOpen((prev) => !prev) : undefined}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 1,
                    cursor: collapsible ? 'pointer' : 'default'
                }}
            >
                <Typography variant="subtitle2" fontWeight={700}>
                    {title}
                </Typography>
                {collapsible && (open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
            </Box>
            <Collapse in={open}>
                <List dense disablePadding sx={{ maxHeight: 260, overflowY: 'auto' }}>
                    {items.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ px: 1.5, pb: 1 }}>
                            Kayıt yok.
                        </Typography>
                    )}
                    {items.map((item) => {
                        const isSelected = selected === item;
                        return (
                            <ListItemButton
                                key={item}
                                selected={isSelected}
                                onClick={() => onSelect(isSelected ? null : item)}
                                sx={{
                                    py: 0.5,
                                    px: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': { bgcolor: 'primary.dark' }
                                    }
                                }}
                            >
                                <ListItemText
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        fontWeight: isSelected ? 700 : 400
                                    }}
                                >
                                    {item}
                                </ListItemText>
                            </ListItemButton>
                        );
                    })}
                </List>
            </Collapse>
        </Box>
    );
}

export default function OrganizasyonFilterSidebar({
    searchText,
    onSearchChange,
    departments,
    selectedDepartment,
    onSelectDepartment,
    projects,
    selectedProject,
    onSelectProject,
    teams,
    selectedTeam,
    onSelectTeam
}) {
    const [collapsed, setCollapsed] = useState(false);

    if (collapsed) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', pt: 0.5 }}>
                <IconButton size="small" onClick={() => setCollapsed(false)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <ChevronRightIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => setCollapsed(true)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Ara"
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </Box>

            <FilterList
                title="Enstitü"
                items={departments}
                selected={selectedDepartment}
                onSelect={onSelectDepartment}
            />

            <FilterList
                title="Projeler"
                items={projects}
                selected={selectedProject}
                onSelect={onSelectProject}
                collapsible={false}
            />

            <FilterList
                title="Teknoloji Birlikleri"
                items={teams}
                selected={selectedTeam}
                onSelect={onSelectTeam}
            />
        </Box>
    );
}