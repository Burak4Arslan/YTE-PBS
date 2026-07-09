package com.yte.pbs.service;

import com.yte.pbs.entity.DirectoryEntry;
import com.yte.pbs.entity.Personnel;
import com.yte.pbs.entity.PersonnelHierarchy;
import com.yte.pbs.repository.DirectoryEntryRepository;
import com.yte.pbs.repository.PersonnelHierarchyRepository;
import com.yte.pbs.repository.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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
    private final DirectoryEntryRepository directoryEntryRepository;
    private final PersonnelHierarchyRepository personnelHierarchyRepository;

    public Personnel addPersonnel(Personnel personnel) {
        // T.C. Kimlik numarası sistemde var mı kontrolü eklenebilir
        if (personnelRepository.findByTcIdentityNumber(personnel.getTcIdentityNumber()).isPresent()) {
            throw new RuntimeException("Bu T.C. Kimlik Numarası ile zaten bir personel kayıtlı!");
        }
        Personnel savedPersonnel = personnelRepository.save(personnel);
        createDirectoryEntry(savedPersonnel);
        createPersonnelHierarchyEntry(savedPersonnel);
        return savedPersonnel;
    }

    private void createDirectoryEntry(Personnel personnel) {
        DirectoryEntry entry = new DirectoryEntry();
        entry.setFullName((personnel.getFirstName() + " " + personnel.getLastName()).trim());
        entry.setUnit(personnel.getDepartment());
        entry.setTitle(personnel.getTitle());
        entry.setDuty(personnel.getDuty());
        entry.setProject(personnel.getProjectWorkedOn());
        entry.setEmail(personnel.getEmail());
        entry.setPhoneNumber(personnel.getPhoneNumber());
        directoryEntryRepository.save(entry);
    }

    private void createPersonnelHierarchyEntry(Personnel personnel) {
        List<PersonnelHierarchy> all = personnelHierarchyRepository.findAllWithSuperior();

        PersonnelHierarchy node = new PersonnelHierarchy();
        node.setUserId(personnel.getId());
        node.setPersonnelName(personnel.getFirstName());
        node.setPersonnelSurname(personnel.getLastName());
        node.setPersonnelJobTitle(buildJobTitle(personnel));
        node.setDepartment(personnel.getDepartment());
        node.setSuperiorPersonnel(resolveHierarchySuperior(all, personnel.getDepartment()));
        personnelHierarchyRepository.save(node);
    }

    private String buildJobTitle(Personnel personnel) {
        if (StringUtils.hasText(personnel.getDuty())) {
            return personnel.getTitle() + " (" + personnel.getDuty() + ")";
        }
        return personnel.getTitle();
    }

    /**
     * Aynı departmandaki mevcut ekibin başında duran kişiyi (üstü farklı
     * departmandan olan ilk kişiyi) bulup yeni personeli onun altına bağlar.
     * Departman için henüz kimse yoksa şemanın kökü (en üstteki müdür) altına eklenir.
     */
    private PersonnelHierarchy resolveHierarchySuperior(List<PersonnelHierarchy> all, String department) {
        PersonnelHierarchy root = all.stream()
                .filter(node -> node.getSuperiorPersonnel() == null)
                .findFirst()
                .orElse(null);

        if (!StringUtils.hasText(department)) {
            return root;
        }

        return all.stream()
                .filter(node -> department.equals(node.getDepartment()))
                .filter(node -> node.getSuperiorPersonnel() == null
                        || !department.equals(node.getSuperiorPersonnel().getDepartment()))
                .findFirst()
                .orElse(root);
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