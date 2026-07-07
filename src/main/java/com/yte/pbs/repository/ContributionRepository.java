package com.yte.pbs.repository;

import com.yte.pbs.entity.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContributionRepository extends JpaRepository<Contribution, Long> {
    List<Contribution> findByUserId(Long userId);
}