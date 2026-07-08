package com.yte.pbs.dto;

public record CustomEnumValueDto(
        Long id,
        Long typeId,
        String value,
        Integer sortOrder,
        boolean active
) {
}
