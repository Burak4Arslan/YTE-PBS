package com.yte.pbs.controller;

import com.yte.pbs.entity.DirectoryEntry;
import com.yte.pbs.repository.DirectoryEntryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/directory")
public class DirectoryEntryController {

    private final DirectoryEntryRepository directoryEntryRepository;

    // Spring Boot 3+ için Constructor Injection (Autowired yazmaya gerek yok)
    public DirectoryEntryController(DirectoryEntryRepository directoryEntryRepository) {
        this.directoryEntryRepository = directoryEntryRepository;
    }

    @GetMapping
    public List<DirectoryEntry> getAllEntries() {
        return directoryEntryRepository.findAll();
    }
}