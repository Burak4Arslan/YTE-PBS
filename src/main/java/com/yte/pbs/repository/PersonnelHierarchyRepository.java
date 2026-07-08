package com.yte.pbs.repository;

import com.yte.pbs.entity.PersonnelHierarchy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonnelHierarchyRepository extends JpaRepository<PersonnelHierarchy, Long> {

    @Query("SELECT ph FROM PersonnelHierarchy ph LEFT JOIN FETCH ph.superiorPersonnel")
    List<PersonnelHierarchy> findAllWithSuperior();

    Optional<PersonnelHierarchy> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
