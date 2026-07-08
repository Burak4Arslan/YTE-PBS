package com.yte.pbs.repository.specification;

import com.yte.pbs.entity.DirectoryEntry;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class DirectoryEntrySpecification {

    public static Specification<DirectoryEntry> filterBy(String fullName, String title, String duty, String unit, String project) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(fullName)) {
                predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + fullName.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(title)) {
                predicates.add(cb.equal(root.get("title"), title));
            }
            if (StringUtils.hasText(duty)) {
                predicates.add(cb.equal(root.get("duty"), duty));
            }
            if (StringUtils.hasText(unit)) {
                predicates.add(cb.equal(root.get("unit"), unit));
            }
            if (StringUtils.hasText(project)) {
                predicates.add(cb.equal(root.get("project"), project));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
