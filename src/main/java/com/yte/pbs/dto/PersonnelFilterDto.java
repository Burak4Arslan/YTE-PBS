package com.yte.pbs.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PersonnelFilterDto {
    private String title;
    private String workType;
    private String projectWorkedOn;
    private String department;
    private String educationType; // Eğitimi Türü
    private String graduationDepartment; // Mezuniyet Bölümü
    private String cadre;
    private String personnelType;
    private String duty;
    private String workStatus;
    private String team;
    private String contribution; // Katkı

    private LocalDate hireDateStart;
    private LocalDate hireDateEnd;

    private LocalDate leaveDateStart;
    private LocalDate leaveDateEnd;
}
