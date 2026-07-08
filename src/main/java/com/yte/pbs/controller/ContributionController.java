package com.yte.pbs.controller;

import com.yte.pbs.dto.ContributionDto;
import com.yte.pbs.service.ContributionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contributions")
public class ContributionController {

    private final ContributionService contributionService;

    public ContributionController(ContributionService contributionService) {
        this.contributionService = contributionService;
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