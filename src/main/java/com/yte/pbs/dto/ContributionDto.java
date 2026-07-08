package com.yte.pbs.dto;

import java.time.LocalDate;

public record ContributionDto(
        Long id,
        Long userId,
        String eventType,
        String description,
        String link,
        String attachedFilePath,
        LocalDate uploadDate
) {}