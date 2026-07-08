'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Avatar,
    Box,
    CircularProgress,
    InputAdornment,
    List,
    ListItemButton,
    ListItemAvatar,
    TextField,
    Typography
} from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PersonnelSectionCard from './PersonnelSectionCard';
import axiosInstance from '../../api/axiosInstance';

function normalize(value) {
    return (value || '').toLocaleLowerCase('tr-TR');
}

function getRoleText(person) {
    return [person.title, person.duty, person.project].filter(Boolean).join(' - ');
}

export default function TeamMembersCard({ currentPersonnelId, onSelectMember }) {
    const router = useRouter();
    const [people, setPeople] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;

        const loadTeam = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await axiosInstance.get('/api/directory');
                if (!ignore) {
                    setPeople(data);
                }
            } catch (requestError) {
                console.error(requestError);
                if (!ignore) {
                    setError('Ekip bilgileri yüklenemedi.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadTeam();

        return () => {
            ignore = true;
        };
    }, []);

    const currentPerson = useMemo(
        () => people.find((person) => String(person.id) === String(currentPersonnelId)),
        [currentPersonnelId, people]
    );

    const teamMembers = useMemo(() => {
        if (!currentPerson) {
            return people;
        }

        const sameTeam = people.filter((person) => (
            person.unit === currentPerson.unit || person.project === currentPerson.project
        ));

        return sameTeam.length > 0 ? sameTeam : people;
    }, [currentPerson, people]);

    const filteredMembers = useMemo(() => {
        const query = normalize(search);

        if (!query) {
            return teamMembers;
        }

        return teamMembers.filter((person) => (
            normalize(person.fullName).includes(query)
            || normalize(person.title).includes(query)
            || normalize(person.duty).includes(query)
            || normalize(person.project).includes(query)
            || normalize(person.unit).includes(query)
        ));
    }, [search, teamMembers]);

    return (
        <PersonnelSectionCard
            icon={<GroupsOutlinedIcon color="primary" fontSize="small" />}
            title="EKİBİM"
        >
            <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ekipte ara"
                sx={{ mb: 1.5 }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        )
                    }
                }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Typography variant="body2" color="error">{error}</Typography>
            ) : filteredMembers.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Ekip üyesi bulunamadı.</Typography>
            ) : (
                <List
                    disablePadding
                    sx={{
                        maxHeight: { xs: 320, md: 620 },
                        overflowY: 'auto',
                        pr: 0.5
                    }}
                >
                    {filteredMembers.map((person) => {
                        const selected = String(person.id) === String(currentPersonnelId);

                        return (
                            <ListItemButton
                                key={person.id}
                                selected={selected}
                                onClick={() => {
                                    if (onSelectMember) {
                                        onSelectMember(person.id);
                                        return;
                                    }

                                    router.push(`/personel/${person.id}`);
                                }}
                                sx={{
                                    alignItems: 'flex-start',
                                    border: '1px solid',
                                    borderColor: selected ? 'primary.main' : 'divider',
                                    borderRadius: 1,
                                    mb: 1,
                                    px: 1,
                                    py: 1,
                                    bgcolor: selected ? 'rgba(236, 30, 36, 0.04)' : 'background.paper',
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(236, 30, 36, 0.06)'
                                    },
                                    '&.Mui-selected:hover, &:hover': {
                                        bgcolor: 'rgba(236, 30, 36, 0.08)'
                                    }
                                }}
                            >
                                <ListItemAvatar sx={{ minWidth: 44 }}>
                                    <Avatar sx={{ width: 34, height: 34, bgcolor: selected ? 'primary.main' : 'grey.400' }}>
                                        <PersonOutlinedIcon fontSize="small" />
                                    </Avatar>
                                </ListItemAvatar>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="body2" fontWeight={700} noWrap>
                                        {person.fullName || '-'}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {getRoleText(person) || person.unit || '-'}
                                    </Typography>
                                </Box>
                            </ListItemButton>
                        );
                    })}
                </List>
            )}
        </PersonnelSectionCard>
    );
}
