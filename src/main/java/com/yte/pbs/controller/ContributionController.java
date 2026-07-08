package com.yte.pbs.controller;

import com.yte.pbs.dto.ContributionDto;
import com.yte.pbs.repository.UserRepository;
import com.yte.pbs.service.ContributionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/contributions")
public class ContributionController {

    private final ContributionService contributionService;
    private final UserRepository userRepository;

    public ContributionController(ContributionService contributionService, UserRepository userRepository) {
        this.contributionService = contributionService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ContributionDto>> getByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(contributionService.getContributionsByUser(user.getId())))
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @PostMapping
    public ResponseEntity<Object> createByEmail(@RequestParam String email, @RequestBody ContributionDto dto) {
        return userRepository.findByEmail(email)
                .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(contributionService.addContribution(user.getId(), dto)))
                .orElse(ResponseEntity.badRequest().body("Katkı eklenemedi: Kullanıcı bulunamadı."));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ContributionDto>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(contributionService.getContributionsByUser(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<ContributionDto> create(@PathVariable Long userId, @RequestBody ContributionDto dto) {
        return ResponseEntity.ok(contributionService.addContribution(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContributionDto> update(@PathVariable Long id, @RequestBody ContributionDto dto) {
        return ResponseEntity.ok(contributionService.editContribution(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contributionService.deleteContribution(id);
        return ResponseEntity.noContent().build();
    }
}