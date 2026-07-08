package com.yte.pbs.controller;

import com.yte.pbs.dto.PersonnelHierarchyDto;
import com.yte.pbs.service.PersonnelHierarchyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/personnel-hierarchy")
public class PersonnelHierarchyController {

    private final PersonnelHierarchyService personnelHierarchyService;

    public PersonnelHierarchyController(PersonnelHierarchyService personnelHierarchyService) {
        this.personnelHierarchyService = personnelHierarchyService;
    }

    @GetMapping
    public ResponseEntity<List<PersonnelHierarchyDto>> getAll() {
        return ResponseEntity.ok(personnelHierarchyService.getAllPersonnelHierarchy());
    }
}