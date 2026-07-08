package com.yte.pbs.controller;

import com.yte.pbs.dto.AttendanceRecordDto;
import com.yte.pbs.repository.UserRepository;
import com.yte.pbs.security.CustomUserDetails;
import com.yte.pbs.service.AttendanceRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceRecordController {

    private final AttendanceRecordService attendanceRecordService;
    private final UserRepository userRepository;

    public AttendanceRecordController(AttendanceRecordService attendanceRecordService, UserRepository userRepository) {
        this.attendanceRecordService = attendanceRecordService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<List<AttendanceRecordDto>> getCurrentUserAttendance(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "week") String range) {
        return ResponseEntity.ok(attendanceRecordService.getCurrentUserAttendance(userDetails, range));
    }

    @GetMapping
    public ResponseEntity<List<AttendanceRecordDto>> getAttendanceByEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "week") String range) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(attendanceRecordService.getAttendanceByUserId(user.getId(), range)))
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }
}
