package com.yte.pbs.service;

import com.yte.pbs.entity.Personnel;
import com.yte.pbs.repository.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.yte.pbs.dto.PersonnelFilterDto;
import com.yte.pbs.repository.specification.PersonnelSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.io.ByteArrayInputStream;
import java.util.List;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonnelService {

    private final PersonnelRepository personnelRepository;
    private final ExcelExportService excelExportService;

    public Personnel addPersonnel(Personnel personnel) {
        // T.C. Kimlik numarası sistemde var mı kontrolü eklenebilir
        if (personnelRepository.findByTcIdentityNumber(personnel.getTcIdentityNumber()).isPresent()) {
            throw new RuntimeException("Bu T.C. Kimlik Numarası ile zaten bir personel kayıtlı!");
        }
        return personnelRepository.save(personnel);
    }

    public List<Personnel> searchPersonnel(PersonnelFilterDto filter) {
        Specification<Personnel> spec = PersonnelSpecification.filterBy(filter);
        return personnelRepository.findAll(spec);
    }

    public ByteArrayInputStream exportToExcel(PersonnelFilterDto filter) {
        List<Personnel> personnelList = searchPersonnel(filter);
        return excelExportService.exportPersonnelToExcel(personnelList);
    }

    public Optional<Personnel> getByEmail(String email) {
        return personnelRepository.findByEmail(email);
    }

    public List<String> getDistinctTitles() { return personnelRepository.findDistinctTitles(); }
    public List<String> getDistinctDuties() { return personnelRepository.findDistinctDuties(); }
    public List<String> getDistinctDepartments() { return personnelRepository.findDistinctDepartments(); }
    public List<String> getDistinctProjects() { return personnelRepository.findDistinctProjects(); }
    public List<String> getDistinctTeams() { return personnelRepository.findDistinctTeams(); }
    public List<String> getDistinctContributions() { return personnelRepository.findDistinctContributions(); }
}