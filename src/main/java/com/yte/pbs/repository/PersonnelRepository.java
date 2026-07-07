package com.yte.pbs.repository;

import com.yte.pbs.entity.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Long> {
    Optional<Personnel> findByTcIdentityNumber(String tcIdentityNumber);
}