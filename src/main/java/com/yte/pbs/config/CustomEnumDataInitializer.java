package com.yte.pbs.config;

import com.yte.pbs.entity.CustomEnumType;
import com.yte.pbs.entity.CustomEnumValue;
import com.yte.pbs.entity.Contribution;
import com.yte.pbs.entity.Education;
import com.yte.pbs.entity.Personnel;
import com.yte.pbs.repository.ContributionRepository;
import com.yte.pbs.repository.CustomEnumTypeRepository;
import com.yte.pbs.repository.CustomEnumValueRepository;
import com.yte.pbs.repository.EducationRepository;
import com.yte.pbs.repository.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class CustomEnumDataInitializer implements CommandLineRunner {

    private final CustomEnumTypeRepository typeRepository;
    private final CustomEnumValueRepository valueRepository;
    private final PersonnelRepository personnelRepository;
    private final EducationRepository educationRepository;
    private final ContributionRepository contributionRepository;

    @Override
    public void run(String... args) {
        initializeType(
                "DEPARTMENT",
                "Birim",
                "GENERAL",
                1,
                List.of()
        );

        initializeType(
                "TITLE",
                "Ünvan",
                "GENERAL",
                2,
                List.of()
        );

        initializeType(
                "PERSONNEL_TYPE",
                "Personel Türü",
                "GENERAL",
                3,
                List.of("Tam Zamanlı", "Stajyer")
        );

        initializeType(
                "ACADEMIC_TITLE",
                "Akademik Ünvan",
                "GENERAL",
                4,
                List.of()
        );

        initializeType(
                "CADRE",
                "Kadro",
                "GENERAL",
                5,
                List.of("Mühendis", "İdari Personel")
        );

        initializeType(
                "WORK_TYPE",
                "Çalışma Türü",
                "GENERAL",
                6,
                List.of("Ofis", "Uzaktan")
        );

        initializeType(
                "WORK_STATUS",
                "Çalışma Durumu",
                "GENERAL",
                7,
                List.of("Aktif", "İzinli")
        );

        initializeType(
                "DUTY",
                "Görevi",
                "GENERAL",
                8,
                List.of()
        );

        initializeType(
                "SHUTTLE_USAGE",
                "Servis Kullanımı",
                "GENERAL",
                9,
                List.of("Evet", "Hayır")
        );

        initializeType(
                "EDUCATION_TYPE",
                "Eğitim Türü",
                "EDUCATION",
                10,
                List.of()
        );

        initializeType(
                "SCHOOL",
                "Üniversite/Okul",
                "EDUCATION",
                11,
                List.of()
        );

        initializeType(
                "EDUCATION_DEPARTMENT",
                "Bölüm",
                "EDUCATION",
                12,
                List.of()
        );

        initializeType(
                "EVENT_TYPE",
                "Etkinlik Türü",
                "CONTRIBUTION",
                13,
                List.of()
        );

        initializeType(
                "FILE_TYPE",
                "Dosya Türü",
                "FILE",
                14,
                List.of("CV", "Sertifika", "Diploma", "Kimlik Belgesi", "Diğer")
        );

        synchronizeExistingValues();
    }

    private void synchronizeExistingValues() {
        List<Personnel> personnel = personnelRepository.findAll();

        initializeValues("DEPARTMENT", personnel.stream().map(Personnel::getDepartment).toList());
        initializeValues("TITLE", personnel.stream().map(Personnel::getTitle).toList());
        initializeValues("PERSONNEL_TYPE", personnel.stream().map(Personnel::getPersonnelType).toList());
        initializeValues("ACADEMIC_TITLE", personnel.stream().map(Personnel::getAcademicTitle).toList());
        initializeValues("CADRE", personnel.stream().map(Personnel::getCadre).toList());
        initializeValues("WORK_TYPE", personnel.stream().map(Personnel::getWorkType).toList());
        initializeValues("WORK_STATUS", personnel.stream().map(Personnel::getWorkStatus).toList());
        initializeValues("DUTY", personnel.stream().map(Personnel::getDuty).toList());
        initializeValues("SHUTTLE_USAGE", personnel.stream().map(Personnel::getShuttleUsage).toList());

        List<Education> educations = educationRepository.findAll();
        initializeValues("EDUCATION_TYPE", educations.stream().map(Education::getEducationType).toList());
        initializeValues("SCHOOL", educations.stream().map(Education::getSchoolName).toList());
        initializeValues("EDUCATION_DEPARTMENT", educations.stream().map(Education::getDepartment).toList());

        initializeValues(
                "EVENT_TYPE",
                contributionRepository.findAll().stream().map(Contribution::getEventType).toList()
        );
    }

    private void initializeValues(String code, List<String> values) {
        CustomEnumType type = typeRepository.findByCodeIgnoreCase(code).orElseThrow();
        int nextSortOrder = valueRepository
                .findByType_IdOrderBySortOrderAscIdAsc(type.getId())
                .stream()
                .map(CustomEnumValue::getSortOrder)
                .filter(java.util.Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0) + 1;

        for (String value : values.stream()
                .filter(item -> item != null && !item.isBlank())
                .distinct()
                .toList()) {
            if (valueRepository.findByType_IdAndValueIgnoreCase(type.getId(), value).isEmpty()) {
                initializeValue(type, value, nextSortOrder++);
            }
        }
    }

    private void initializeType(
            String code,
            String displayName,
            String category,
            int sortOrder,
            List<String> defaultValues) {

        CustomEnumType type = typeRepository.findByCodeIgnoreCase(code)
                .orElseGet(() -> {
                    CustomEnumType newType = new CustomEnumType();
                    newType.setCode(code);
                    newType.setDisplayName(displayName);
                    newType.setCategory(category);
                    newType.setSortOrder(sortOrder);
                    return typeRepository.save(newType);
                });

        for (int index = 0; index < defaultValues.size(); index++) {
            initializeValue(type, defaultValues.get(index), index + 1);
        }
    }

    private void initializeValue(
            CustomEnumType type,
            String value,
            int sortOrder) {

        if (valueRepository
                .findByType_IdAndValueIgnoreCase(type.getId(), value)
                .isPresent()) {
            return;
        }

        CustomEnumValue newValue = new CustomEnumValue();
        newValue.setType(type);
        newValue.setValue(value);
        newValue.setSortOrder(sortOrder);
        newValue.setActive(true);

        valueRepository.save(newValue);
    }
}
