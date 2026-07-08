package com.yte.pbs.repository;

import com.yte.pbs.entity.Personnel;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Long>, JpaSpecificationExecutor<Personnel> {

    Optional<Personnel> findByTcIdentityNumber(String tcIdentityNumber);

    Optional<Personnel> findByEmail(String email);

    // --- REHBER DROPDOWN FİLTRELERİ İÇİN DİNAMİK SORGULAR ---

    @Query("SELECT DISTINCT p.title FROM Personnel p WHERE p.title IS NOT NULL")
    List<String> findDistinctTitles();

    @Query("SELECT DISTINCT p.duty FROM Personnel p WHERE p.duty IS NOT NULL")
    List<String> findDistinctDuties();

    @Query("SELECT DISTINCT p.department FROM Personnel p WHERE p.department IS NOT NULL")
    List<String> findDistinctDepartments();

    @Query("SELECT DISTINCT p.projectWorkedOn FROM Personnel p WHERE p.projectWorkedOn IS NOT NULL")
    List<String> findDistinctProjects();
}