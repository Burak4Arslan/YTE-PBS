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
import org.springframework.security.core.Authentication;
import com.yte.pbs.security.CustomUserDetails;
import com.yte.pbs.dto.PersonnelPublicDto;

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
    public ResponseEntity<?> getPersonnelByEmail(@RequestParam String email, Authentication authentication) {
        return personnelService.getByEmail(email)
                .map(personnel -> {
                    boolean isAdmin = authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    
                    String currentUserEmail = null;
                    if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
                        currentUserEmail = userDetails.getUser().getEmail();
                    } else if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails ud) {
                        currentUserEmail = ud.getUsername(); // If fallback
                    } else {
                        currentUserEmail = authentication.getName();
                    }

                    boolean isOwner = email.equalsIgnoreCase(currentUserEmail);

                    if (isAdmin || isOwner) {
                        return ResponseEntity.ok(personnel);
                    } else {
                        return ResponseEntity.ok(new PersonnelPublicDto(personnel));
                    }
                })
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/latest")
    public ResponseEntity<Personnel> getLatestPersonnel() {
        return personnelService.getLatestPersonnel()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }


    @GetMapping("/options/titles")
    public ResponseEntity<List<String>> getTitles() {
        return ResponseEntity.ok(personnelService.getDistinctTitles());
    }

    @GetMapping("/options/duties")
    public ResponseEntity<List<String>> getDuties() {
        return ResponseEntity.ok(personnelService.getDistinctDuties());
    }

    @GetMapping("/options/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(personnelService.getDistinctDepartments());
    }

    @GetMapping("/options/projects")
    public ResponseEntity<List<String>> getProjects() {
        return ResponseEntity.ok(personnelService.getDistinctProjects());
    }

    @GetMapping("/options/teams")
    public ResponseEntity<List<String>> getTeams() {
        return ResponseEntity.ok(personnelService.getDistinctTeams());
    }

    @GetMapping("/options/contributions")
    public ResponseEntity<List<String>> getContributions() {
        return ResponseEntity.ok(personnelService.getDistinctContributions());
    }
}