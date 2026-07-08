package com.yte.pbs.service;

import com.yte.pbs.dto.AttendanceRecordDto;
import com.yte.pbs.entity.AttendanceRecord;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.AttendanceRecordRepository;
import com.yte.pbs.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@Transactional(readOnly = true)
public class AttendanceRecordService {

    private final AttendanceRecordRepository attendanceRecordRepository;

    public AttendanceRecordService(AttendanceRecordRepository attendanceRecordRepository) {
        this.attendanceRecordRepository = attendanceRecordRepository;
    }

    public List<AttendanceRecordDto> getCurrentUserAttendance(CustomUserDetails userDetails, String range) {
        return getAttendanceByUserId(userDetails.getUser().getId(), range);
    }

    public List<AttendanceRecordDto> getAttendanceByUserId(Long userId, String range) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = switch (range == null ? "week" : range) {
            case "month" -> endDate.minusDays(30);
            case "threeMonths" -> endDate.minusDays(90);
            default -> endDate.minusDays(7);
        };

        return attendanceRecordRepository
                .findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDescCheckInTimeDescIdDesc(userId, startDate, endDate)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AttendanceRecordDto recordLogin(User user) {
        LocalTime now = currentTime();
        closeOpenRecords(user, now);

        AttendanceRecord attendanceRecord = new AttendanceRecord();
        attendanceRecord.setUser(user);
        attendanceRecord.setAttendanceDate(LocalDate.now());
        attendanceRecord.setCheckInTime(now);

        return toDto(attendanceRecordRepository.save(attendanceRecord));
    }

    @Transactional
    public void recordLogout(User user) {
        AttendanceRecord attendanceRecord = attendanceRecordRepository
                .findTopByUserIdAndCheckOutTimeIsNullOrderByAttendanceDateDescCheckInTimeDescIdDesc(user.getId())
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "A\u00e7\u0131k giri\u015f kayd\u0131 bulunamad\u0131."));

        attendanceRecord.setCheckOutTime(currentTime());
        attendanceRecordRepository.save(attendanceRecord);
    }

    private void closeOpenRecords(User user, LocalTime checkOutTime) {
        List<AttendanceRecord> openRecords = attendanceRecordRepository
                .findByUserIdAndCheckOutTimeIsNullOrderByAttendanceDateDescCheckInTimeDescIdDesc(user.getId());

        if (openRecords.isEmpty()) {
            return;
        }

        openRecords.forEach(openRecord -> openRecord.setCheckOutTime(checkOutTime));
        attendanceRecordRepository.saveAll(openRecords);
    }

    private LocalTime currentTime() {
        return LocalTime.now().withNano(0);
    }

    private AttendanceRecordDto toDto(AttendanceRecord attendanceRecord) {
        return new AttendanceRecordDto(
                attendanceRecord.getId(),
                attendanceRecord.getAttendanceDate(),
                attendanceRecord.getCheckInTime(),
                attendanceRecord.getCheckOutTime());
    }
}
