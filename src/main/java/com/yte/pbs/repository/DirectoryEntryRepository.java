package com.yte.pbs.repository;

import com.yte.pbs.entity.DirectoryEntry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectoryEntryRepository extends JpaRepository<DirectoryEntry, Long>, JpaSpecificationExecutor<DirectoryEntry> {

    @Query("SELECT DISTINCT d.title FROM DirectoryEntry d WHERE d.title IS NOT NULL")
    List<String> findDistinctTitles();

    @Query("SELECT DISTINCT d.duty FROM DirectoryEntry d WHERE d.duty IS NOT NULL")
    List<String> findDistinctDuties();

    @Query("SELECT DISTINCT d.unit FROM DirectoryEntry d WHERE d.unit IS NOT NULL")
    List<String> findDistinctUnits();

    @Query("SELECT DISTINCT d.project FROM DirectoryEntry d WHERE d.project IS NOT NULL")
    List<String> findDistinctProjects();
}
