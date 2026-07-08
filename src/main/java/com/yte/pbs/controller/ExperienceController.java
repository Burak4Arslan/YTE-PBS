package com.yte.pbs.controller;

import com.yte.pbs.dto.ExperienceDto;
import com.yte.pbs.service.ExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExperienceDto>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(experienceService.getExperiencesByUser(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<ExperienceDto> create(@PathVariable Long userId, @RequestBody ExperienceDto dto) {
        return ResponseEntity.ok(experienceService.addExperience(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienceDto> update(@PathVariable Long id, @RequestBody ExperienceDto dto) {
        return ResponseEntity.ok(experienceService.editExperience(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}