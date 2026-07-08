package com.yte.pbs.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceRecordDto(
        Long id,
        LocalDate attendanceDate,
        LocalTime checkInTime,
        LocalTime checkOutTime
) {}
