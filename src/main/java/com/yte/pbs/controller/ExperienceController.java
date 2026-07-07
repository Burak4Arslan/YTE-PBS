package com.yte.pbs.controller;

import com.yte.pbs.dto.ExperienceDto;
import com.yte.pbs.service.ExperienceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @GetMapping("/users/{userId}/experiences")
    public ResponseEntity<List<ExperienceDto>> getExperiences(@PathVariable Long userId) {
        return ResponseEntity.ok(experienceService.getExperiencesByUser(userId));
    }

    @PostMapping("/users/{userId}/experiences")
    public ResponseEntity<ExperienceDto> createExperience(@PathVariable Long userId, @RequestBody ExperienceDto dto) {
        return new ResponseEntity<>(experienceService.addExperience(userId, dto), HttpStatus.CREATED);
    }

    @PutMapping("/experiences/{experienceId}")
    public ResponseEntity<ExperienceDto> updateExperience(@PathVariable Long experienceId, @RequestBody ExperienceDto dto) {
        return ResponseEntity.ok(experienceService.editExperience(experienceId, dto));
    }

    @DeleteMapping("/experiences/{experienceId}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long experienceId) {
        experienceService.deleteExperience(experienceId);
        return ResponseEntity.noContent().build();
    }
}