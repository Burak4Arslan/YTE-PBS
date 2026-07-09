package com.yte.pbs.controller;

import com.yte.pbs.entity.Project;
import com.yte.pbs.entity.DirectoryEntry;
import com.yte.pbs.repository.ProjectRepository;
import com.yte.pbs.repository.DirectoryEntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final DirectoryEntryRepository directoryEntryRepository;

    // Injecting both repositories via constructor
    public ProjectController(ProjectRepository projectRepository, DirectoryEntryRepository directoryEntryRepository) {
        this.projectRepository = projectRepository;
        this.directoryEntryRepository = directoryEntryRepository;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getUserProjects(@RequestParam String email) {
        // 1. Find the directory entry by email to see what project name string they have
        // (Assuming you have a findByEmail method in DirectoryEntryRepository, or we can look it up via findAll streams)
        List<DirectoryEntry> entries = directoryEntryRepository.findAll();

        Optional<DirectoryEntry> matchingEntry = entries.stream()
                .filter(entry -> email.equalsIgnoreCase(entry.getEmail()))
                .findFirst();

        if (matchingEntry.isEmpty() || matchingEntry.get().getProject() == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        String assignedProjectName = matchingEntry.get().getProject();

        // 2. Query the master projects table by the project name string
        Optional<Project> projectOpt = projectRepository.findByProjectName(assignedProjectName);

        if (projectOpt.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Return it as a list since your frontend expects an array of projects
        return ResponseEntity.ok(List.of(projectOpt.get()));
    }
}