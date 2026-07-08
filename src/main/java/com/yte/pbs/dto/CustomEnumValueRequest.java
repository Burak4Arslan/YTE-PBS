package com.yte.pbs.dto;

public record CustomEnumValueRequest(
        String value,
        Integer sortOrder
) {
}
