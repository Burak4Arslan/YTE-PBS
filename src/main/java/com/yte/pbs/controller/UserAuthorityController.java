package com.yte.pbs.controller;

import com.yte.pbs.dto.UserAuthorityDto;
import com.yte.pbs.dto.UpdateUserAuthoritiesRequest;
import com.yte.pbs.service.UserAuthorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yetkilendirme")
@RequiredArgsConstructor
public class UserAuthorityController {

    private final UserAuthorityService userAuthorityService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserAuthorityDto>> getAllUsersAuthorities() {
        return ResponseEntity.ok(userAuthorityService.getAllUsersAuthorities());
    }

    @PostMapping("/kaydet")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateAuthorities(@RequestBody UpdateUserAuthoritiesRequest request) {
        userAuthorityService.updateUserAuthorities(request);
        return ResponseEntity.ok().build();
    }
}
