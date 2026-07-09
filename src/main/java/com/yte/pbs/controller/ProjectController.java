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

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<Project> getAllProjects(@RequestParam String email) {
            return projectRepository.findAll();
    }
}