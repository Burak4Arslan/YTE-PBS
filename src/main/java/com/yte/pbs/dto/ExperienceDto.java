package com.yte.pbs.dto;

import java.time.LocalDate;

public record ExperienceDto(
        Long id,
        String workPlace,
        String role,
        String workType,
        LocalDate startDate,
        LocalDate endDate,
        String reasonOfLeave
) {}