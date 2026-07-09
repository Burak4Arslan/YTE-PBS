package com.yte.pbs.service;

import com.yte.pbs.dto.PersonnelHierarchyDto;
import com.yte.pbs.entity.PersonnelHierarchy;
import com.yte.pbs.repository.PersonnelHierarchyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PersonnelHierarchyService {

    private final PersonnelHierarchyRepository personnelHierarchyRepository;

    public PersonnelHierarchyService(PersonnelHierarchyRepository personnelHierarchyRepository) {
        this.personnelHierarchyRepository = personnelHierarchyRepository;
    }

    public List<PersonnelHierarchyDto> getAllPersonnelHierarchy() {
        return personnelHierarchyRepository.findAllWithSuperior().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private PersonnelHierarchyDto toDto(PersonnelHierarchy entity) {
        PersonnelHierarchy superior = entity.getSuperiorPersonnel();
        return new PersonnelHierarchyDto(
                entity.getId(),
                entity.getUserId(),
                entity.getPersonnelName(),
                entity.getPersonnelSurname(),
                entity.getPersonnelJobTitle(),
                entity.getDepartment(),
                superior != null ? superior.getId() : null
        );
    }
}