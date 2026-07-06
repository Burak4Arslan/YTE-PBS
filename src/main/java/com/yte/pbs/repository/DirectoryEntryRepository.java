package com.yte.pbs.repository;

import com.yte.pbs.entity.DirectoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectoryEntryRepository extends JpaRepository<DirectoryEntry, Long> {
}
