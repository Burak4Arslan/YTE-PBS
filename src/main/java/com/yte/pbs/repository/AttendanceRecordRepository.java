package com.yte.pbs.repository;

import com.yte.pbs.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByUserIdOrderByAttendanceDateDescCheckInTimeDescIdDesc(Long userId);

    List<AttendanceRecord> findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDescCheckInTimeDescIdDesc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate);

    List<AttendanceRecord> findByUserIdAndCheckOutTimeIsNullOrderByAttendanceDateDescCheckInTimeDescIdDesc(
            Long userId);

    Optional<AttendanceRecord> findTopByUserIdAndCheckOutTimeIsNullOrderByAttendanceDateDescCheckInTimeDescIdDesc(
            Long userId);
}
