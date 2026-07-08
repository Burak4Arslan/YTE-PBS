package com.yte.pbs.repository;

import com.yte.pbs.entity.CustomEnumType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomEnumTypeRepository extends JpaRepository<CustomEnumType, Long> {

    Optional<CustomEnumType> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<CustomEnumType> findAllByOrderBySortOrderAscIdAsc();
}
