'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
    Box,
    CircularProgress,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import PersonnelSectionCard from './PersonnelSectionCard';
import { getAttendanceRecordsByEmail, getMyAttendanceRecords } from '../services/personnelDetailService';

const rangeOptions = [
    { value: 'week', label: 'Son 1 Hafta' },
    { value: 'month', label: 'Son 1 Ay' },
    { value: 'threeMonths', label: 'Son 3 Ay' }
];

function formatDate(value) {
    if (!value) return '-';
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
}

function formatTime(value) {
    if (!value) return '-';
    return value.slice(0, 5);
}

export default function AttendanceCard({ email }) {
    const [range, setRange] = useState('week');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadAttendanceRecords = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = email
                ? await getAttendanceRecordsByEmail(email, range)
                : await getMyAttendanceRecords(range);
            setRecords(data);
        } catch (requestError) {
            console.error(requestError);
            setError('Giriş-çıkış kayıtları yüklenemedi.');
        } finally {
            setLoading(false);
        }
    }, [email, range]);

    useEffect(() => {
        queueMicrotask(loadAttendanceRecords);
    }, [loadAttendanceRecords]);

    const action = (
        <Select
            size="small"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            MenuProps={{

                disableScrollLock: true,

            }}
            sx={{ minWidth: 150, fontSize: 13 }}
        >
            {rangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
        </Select>
    );

    return (
        <PersonnelSectionCard
            icon={<AccessTimeIcon color="primary" fontSize="small" />}
            title="MTS"
            action={action}
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Typography variant="body2" color="error">{error}</Typography>
            ) : records.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Kayıt bulunamadı.</Typography>
            ) : (
                <TableContainer sx={{ maxHeight: 240 }}>
                    <Table stickyHeader size="small" aria-label="MTS">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Tarih</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Giriş</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Çıkış</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{formatDate(record.attendanceDate)}</TableCell>
                                    <TableCell>{formatTime(record.checkInTime)}</TableCell>
                                    <TableCell>{formatTime(record.checkOutTime)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </PersonnelSectionCard>
    );
}
