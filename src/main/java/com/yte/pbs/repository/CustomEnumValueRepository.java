package com.yte.pbs.repository;

import com.yte.pbs.entity.CustomEnumValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomEnumValueRepository extends JpaRepository<CustomEnumValue, Long> {

    List<CustomEnumValue> findByType_IdOrderBySortOrderAscIdAsc(Long typeId);

    List<CustomEnumValue> findByType_IdAndActiveTrueOrderBySortOrderAscIdAsc(Long typeId);

    boolean existsByType_IdAndValueIgnoreCase(Long typeId, String value);
}
