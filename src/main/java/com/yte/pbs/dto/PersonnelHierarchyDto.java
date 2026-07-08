package com.yte.pbs.dto;

public record

PersonnelHierarchyDto(
         Long id,
         Long userId,
         String personnelName,
         String personnelSurname,
         String personnelJobTitle,
         Long superiorPersonnelId
){}
