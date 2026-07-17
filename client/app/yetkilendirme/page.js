'use client';
import { useState, useEffect } from 'react';
import RoleGuard from '../components/RoleGuard';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    InputAdornment,
    Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const ROLES = ['Standart Kullanıcı', 'Yetkili Kullanıcı', 'Süper Kullanıcı', 'Admin'];

export default function YetkilendirmePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [newUserSearch, setNewUserSearch] = useState('');

    useEffect(() => {
        const userRole = localStorage.getItem('user_role');

        if (userRole !== 'ADMIN') {
            return;
        }

        const fetchUsers = async () => {
            try {
                const [listedResponse, registeredResponse] = await Promise.all([
                    axiosInstance.get('/api/yetkilendirme'),
                    axiosInstance.get('/api/yetkilendirme/kayitli-kullanicilar')
                ]);
                setUsers(listedResponse.data || []);
                setRegisteredUsers(registeredResponse.data || []);
            } catch (error) {
                console.error("Yetkiler alınamadı", error);
                toast.error("Yetkiler alınırken bir hata oluştu");
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            // Send updated users and roles to backend
            await axiosInstance.post('/api/yetkilendirme/kaydet', { users });
            toast.success("Yetkiler başarıyla kaydedildi!");
            setIsEditing(false);
        } catch (error) {
            console.error("Kaydetme hatası", error);
            // Error handling is managed by axios interceptor but we can still show local feedback if needed
        }
    };

    const handleRoleChange = (userId, roleName, isChecked) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === userId) {
                let updatedRoles = [...user.roles];
                if (isChecked) {
                    if (!updatedRoles.includes(roleName)) {
                        updatedRoles.push(roleName);
                    }
                } else {
                    updatedRoles = updatedRoles.filter(r => r !== roleName);
                }
                return { ...user, roles: updatedRoles };
            }
            return user;
        }));
    };

    const handleAddUser = () => {
        if (!newUserSearch.trim()) return;

        const normalizedSearch = newUserSearch.trim().toLocaleLowerCase('tr-TR');
        const selectedUser = registeredUsers.find(user =>
            user.name.toLocaleLowerCase('tr-TR') === normalizedSearch
        );

        if (!selectedUser) {
            toast.warning('Lütfen sistemde kayıtlı bir kullanıcı seçin.');
            return;
        }

        if (users.some(user => user.id === selectedUser.id)) {
            toast.info('Bu kullanıcı zaten yetkilendirme listesinde.');
            return;
        }

        setUsers([...users, {
            ...selectedUser,
            roles: selectedUser.roles?.length
                ? selectedUser.roles
                : ['Standart Kullanıcı']
        }]);
        setNewUserSearch('');
    };

    const matchingUsers = newUserSearch.trim()
        ? registeredUsers
            .filter(candidate => !users.some(user => user.id === candidate.id))
            .filter(candidate => candidate.name
                .toLocaleLowerCase('tr-TR')
                .includes(newUserSearch.trim().toLocaleLowerCase('tr-TR')))
            .slice(0, 5)
        : [];

    return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', mt: 4, px: 3 }}>
                <TableContainer component={Paper} elevation={0} sx={{ borderBottom: '1px solid #e0e0e0', borderRadius: 0 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderBottom: '2px solid #000', fontWeight: 'bold' }}></TableCell>
                                {ROLES.map(role => (
                                    <TableCell key={role} align="center" sx={{ borderBottom: '2px solid #000', fontWeight: 'bold', pb: 2 }}>
                                        {role}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500, borderBottom: '1px solid #e0e0e0' }}>
                                        {user.name}
                                    </TableCell>
                                    {ROLES.map(role => {
                                        const hasRole = user.roles.includes(role);
                                        return (
                                            <TableCell key={role} align="center" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                                {isEditing ? (
                                                    <Checkbox 
                                                        checked={hasRole}
                                                        onChange={(e) => handleRoleChange(user.id, role, e.target.checked)}
                                                        color="default"
                                                        sx={{ '&.Mui-checked': { color: '#000' } }}
                                                    />
                                                ) : (
                                                    hasRole ? 
                                                    <CheckCircleIcon sx={{ color: '#4caf50' }} /> : 
                                                    <CancelIcon sx={{ color: '#f44336' }} />
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {isEditing && (
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ position: 'relative', width: '250px' }}>
                            <TextField
                                size="small"
                                placeholder="Kemal Yılmaz"
                                value={newUserSearch}
                                onChange={(e) => setNewUserSearch(e.target.value)}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '4px', bgcolor: '#fff', width: '250px' }
                                    }
                                }}
                            />
                            {matchingUsers.length > 0 && (
                                <Paper sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    zIndex: 10,
                                    mt: 0.5,
                                    overflow: 'hidden'
                                }}>
                                    {matchingUsers.map(candidate => (
                                        <Box
                                            key={candidate.id}
                                            onClick={() => setNewUserSearch(candidate.name)}
                                            sx={{
                                                px: 1.5,
                                                py: 1,
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: '#f5f5f5' }
                                            }}
                                        >
                                            {candidate.name}
                                        </Box>
                                    ))}
                                </Paper>
                            )}
                        </Box>
                        <Button 
                            variant="contained" 
                            onClick={handleAddUser}
                            sx={{ 
                                bgcolor: '#000', 
                                color: '#fff', 
                                '&:hover': { bgcolor: '#333' },
                                borderRadius: '4px',
                                px: 4,
                                py: 0.8
                            }}
                        >
                            EKLE
                        </Button>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 4 }}>
                    {!isEditing ? (
                        <Button 
                            variant="contained" 
                            onClick={handleEditClick}
                            sx={{ 
                                bgcolor: '#000', 
                                color: '#fff', 
                                '&:hover': { bgcolor: '#333' },
                                borderRadius: '8px',
                                px: 4,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 'bold'
                            }}
                        >
                            Düzenle
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            onClick={handleSaveClick}
                            sx={{ 
                                bgcolor: '#000', 
                                color: '#fff', 
                                '&:hover': { bgcolor: '#333' },
                                borderRadius: '8px',
                                px: 4,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 'bold'
                            }}
                        >
                            KAYDET
                        </Button>
                    )}
                </Box>
            </Box>
        </RoleGuard>
    );
}
