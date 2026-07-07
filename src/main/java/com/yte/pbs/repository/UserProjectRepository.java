package com.yte.pbs.repository;


import com.yte.pbs.entity.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserProjectRepository extends JpaRepository<UserProject, Long> {
    List<UserProject> findByUserId(Long userId);
}
