package com.yte.pbs.controller;

import com.yte.pbs.entity.Personnel;
import com.yte.pbs.service.PersonnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/personnel")
@RequiredArgsConstructor
public class PersonnelController {

    private final PersonnelService personnelService;

    // SADECE ADMIN ROLÜNE SAHİP KULLANICILAR BU İSTEĞİ ATABİLİR
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Personnel> createPersonnel(@RequestBody Personnel personnel) {
        Personnel savedPersonnel = personnelService.addPersonnel(personnel);
        return ResponseEntity.ok(savedPersonnel);
    }
}