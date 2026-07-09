package com.yte.pbs.controller;

import com.yte.pbs.entity.DirectoryEntry;
import com.yte.pbs.repository.DirectoryEntryRepository;
import com.yte.pbs.repository.specification.DirectoryEntrySpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/directory")
public class DirectoryEntryController {

    private final DirectoryEntryRepository directoryEntryRepository;

    public DirectoryEntryController(DirectoryEntryRepository directoryEntryRepository) {
        this.directoryEntryRepository = directoryEntryRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DirectoryEntry> getEntryById(@PathVariable Long id) {
        return directoryEntryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<DirectoryEntry> getAllEntries(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String duty,
            @RequestParam(required = false) String unit,
            @RequestParam(required = false) String project
    ) {
        Specification<DirectoryEntry> spec = DirectoryEntrySpecification.filterBy(fullName, title, duty, unit, project);
        return directoryEntryRepository.findAll(spec);
    }

    @GetMapping("/options/titles")
    public List<String> getTitles() {
        return directoryEntryRepository.findDistinctTitles();
    }

    @GetMapping("/options/duties")
    public List<String> getDuties() {
        return directoryEntryRepository.findDistinctDuties();
    }

    @GetMapping("/options/units")
    public List<String> getUnits() {
        return directoryEntryRepository.findDistinctUnits();
    }

    @GetMapping("/options/projects")
    public List<String> getProjects() {
        return directoryEntryRepository.findDistinctProjects();
    }
}