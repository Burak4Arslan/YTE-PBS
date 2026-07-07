package com.yte.pbs.repository;

import com.yte.pbs.entity.PersonnelFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonnelFileRepository extends JpaRepository<PersonnelFile, Long> {

    List<PersonnelFile> findByUserIdOrderByCreatedAtDesc(Long userId);
}
