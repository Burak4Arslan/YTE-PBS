package com.yte.pbs.dto;

import java.util.List;

public record CustomEnumBulkValueRequest(
        List<String> values
) {
}
