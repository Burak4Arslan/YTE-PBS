package com.yte.pbs.repository.specification;

import com.yte.pbs.dto.PersonnelFilterDto;
import com.yte.pbs.entity.Personnel;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class PersonnelSpecification {

    public static Specification<Personnel> filterBy(PersonnelFilterDto filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(filter.getTitle())) {
                predicates.add(cb.equal(root.get("title"), filter.getTitle()));
            }
            if (StringUtils.hasText(filter.getWorkType())) {
                predicates.add(cb.equal(root.get("workType"), filter.getWorkType()));
            }
            if (StringUtils.hasText(filter.getProjectWorkedOn())) {
                predicates.add(cb.equal(root.get("projectWorkedOn"), filter.getProjectWorkedOn()));
            }
            if (StringUtils.hasText(filter.getDepartment())) {
                predicates.add(cb.equal(root.get("department"), filter.getDepartment()));
            }
            if (StringUtils.hasText(filter.getEducationType())) {
                predicates.add(cb.equal(root.get("educationType"), filter.getEducationType()));
            }
            if (StringUtils.hasText(filter.getGraduationDepartment())) {
                predicates.add(cb.equal(root.get("graduationDepartment"), filter.getGraduationDepartment()));
            }
            if (StringUtils.hasText(filter.getCadre())) {
                predicates.add(cb.equal(root.get("cadre"), filter.getCadre()));
            }
            if (StringUtils.hasText(filter.getPersonnelType())) {
                predicates.add(cb.equal(root.get("personnelType"), filter.getPersonnelType()));
            }
            if (StringUtils.hasText(filter.getDuty())) {
                predicates.add(cb.equal(root.get("duty"), filter.getDuty()));
            }
            if (StringUtils.hasText(filter.getWorkStatus())) {
                predicates.add(cb.equal(root.get("workStatus"), filter.getWorkStatus()));
            }
            if (StringUtils.hasText(filter.getTeam())) {
                predicates.add(cb.equal(root.get("team"), filter.getTeam()));
            }
            if (StringUtils.hasText(filter.getContribution())) {
                predicates.add(cb.equal(root.get("contribution"), filter.getContribution()));
            }

            if (filter.getHireDateStart() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("hireDate"), filter.getHireDateStart()));
            }
            if (filter.getHireDateEnd() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("hireDate"), filter.getHireDateEnd()));
            }
            
            if (filter.getLeaveDateStart() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("leaveDate"), filter.getLeaveDateStart()));
            }
            if (filter.getLeaveDateEnd() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("leaveDate"), filter.getLeaveDateEnd()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
