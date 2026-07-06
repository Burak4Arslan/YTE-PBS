package com.yte.pbs.repository;

import com.yte.pbs.entity.EmployeeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeEventRepository extends JpaRepository<EmployeeEvent, Long> {
}