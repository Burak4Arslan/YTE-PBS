package com.yte.pbs.dto;

public record CustomEnumTypeDto(
        Long id,
        String code,
        String displayName,
        String category,
        Integer sortOrder
) {
}
