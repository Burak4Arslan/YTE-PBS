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

// Mock initial data based on the screenshot
const initialUsers = [
    { id: 1, name: 'Cemre Çelik', roles: ['Standart Kullanıcı'] },
    { id: 2, name: 'Çağatay Yamak', roles: ['Standart Kullanıcı', 'Yetkili Kullanıcı'] },
    { id: 3, name: 'Ufuk Veysel Dedeoğlu', roles: ['Standart Kullanıcı', 'Yetkili Kullanıcı', 'Süper Kullanıcı'] },
    { id: 4, name: 'Elif Martel', roles: ['Standart Kullanıcı', 'Yetkili Kullanıcı', 'Süper Kullanıcı', 'Admin'] }
];

export default function YetkilendirmePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState(initialUsers);
    const [newUserSearch, setNewUserSearch] = useState('');

    // If there is an actual endpoint to fetch users and their roles, we would call it here.
    // useEffect(() => {
    //     axiosInstance.get('/api/users/roles').then(res => setUsers(res.data));
    // }, []);

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
        
        // Mock adding user
        const newUser = {
            id: Date.now(),
            name: newUserSearch,
            roles: ['Standart Kullanıcı']
        };
        setUsers([...users, newUser]);
        setNewUserSearch('');
    };

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