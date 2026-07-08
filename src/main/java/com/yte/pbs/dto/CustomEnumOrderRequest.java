package com.yte.pbs.dto;

import java.util.List;

public record CustomEnumOrderRequest(
        List<Long> valueIds
) {
}
