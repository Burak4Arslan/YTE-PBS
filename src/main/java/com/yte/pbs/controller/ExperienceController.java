package com.yte.pbs.controller;

import com.yte.pbs.dto.ExperienceDto;
import com.yte.pbs.repository.UserRepository;
import com.yte.pbs.service.ExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;
    private final UserRepository userRepository;

    public ExperienceController(ExperienceService experienceService, UserRepository userRepository) {
        this.experienceService = experienceService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ExperienceDto>> getByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(experienceService.getExperiencesByUser(user.getId())))
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @PostMapping
    public ResponseEntity<Object> createByEmail(@RequestParam String email, @RequestBody ExperienceDto dto) {
        return userRepository.findByEmail(email)
                .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(experienceService.addExperience(user.getId(), dto)))
                .orElse(ResponseEntity.badRequest().body("Deneyim eklenemedi: Kullanıcı bulunamadı."));
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