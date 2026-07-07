package com.yte.pbs.controller;

import com.yte.pbs.dto.ContributionDto;
import com.yte.pbs.service.ContributionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ContributionController {

    private final ContributionService contributionService;

    public ContributionController(ContributionService contributionService) {
        this.contributionService = contributionService;
    }

    @GetMapping("/users/{userId}/contributions")
    public ResponseEntity<List<ContributionDto>> getContributions(@PathVariable Long userId) {
        return ResponseEntity.ok(contributionService.getContributionsByUser(userId));
    }

    @PostMapping("/users/{userId}/contributions")
    public ResponseEntity<ContributionDto> createContribution(@PathVariable Long userId, @RequestBody ContributionDto dto) {
        return new ResponseEntity<>(contributionService.addContribution(userId, dto), HttpStatus.CREATED);
    }

    @PutMapping("/contributions/{contributionId}")
    public ResponseEntity<ContributionDto> updateContribution(@PathVariable Long contributionId, @RequestBody ContributionDto dto) {
        return ResponseEntity.ok(contributionService.editContribution(contributionId, dto));
    }

    @DeleteMapping("/contributions/{contributionId}")
    public ResponseEntity<Void> deleteContribution(@PathVariable Long contributionId) {
        contributionService.deleteContribution(contributionId);
        return ResponseEntity.noContent().build();
    }
}