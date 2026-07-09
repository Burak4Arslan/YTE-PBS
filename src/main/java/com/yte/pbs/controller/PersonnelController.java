package com.yte.pbs.controller;

import com.yte.pbs.entity.Personnel;
import com.yte.pbs.service.PersonnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.yte.pbs.dto.PersonnelFilterDto;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.ByteArrayInputStream;
import java.util.List;

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

    @PostMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Personnel>> searchPersonnel(@RequestBody PersonnelFilterDto filter) {
        List<Personnel> personnelList = personnelService.searchPersonnel(filter);
        return ResponseEntity.ok(personnelList);
    }

    @PostMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> exportPersonnel(@RequestBody PersonnelFilterDto filter) {
        ByteArrayInputStream in = personnelService.exportToExcel(filter);
        InputStreamResource file = new InputStreamResource(in);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=personel_raporu.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    @GetMapping
    public ResponseEntity<Personnel> getPersonnelByEmail(@RequestParam String email) {
        return personnelService.getByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/options/titles")
    public ResponseEntity<List<String>> getTitles() { return ResponseEntity.ok(personnelService.getDistinctTitles()); }
    
    @GetMapping("/options/duties")
    public ResponseEntity<List<String>> getDuties() { return ResponseEntity.ok(personnelService.getDistinctDuties()); }

    @GetMapping("/options/departments")
    public ResponseEntity<List<String>> getDepartments() { return ResponseEntity.ok(personnelService.getDistinctDepartments()); }

    @GetMapping("/options/projects")
    public ResponseEntity<List<String>> getProjects() { return ResponseEntity.ok(personnelService.getDistinctProjects()); }

    @GetMapping("/options/teams")
    public ResponseEntity<List<String>> getTeams() { return ResponseEntity.ok(personnelService.getDistinctTeams()); }

    @GetMapping("/options/contributions")
    public ResponseEntity<List<String>> getContributions() { return ResponseEntity.ok(personnelService.getDistinctContributions()); }
}