package com.yte.pbs.config;

import com.yte.pbs.entity.CustomEnumType;
import com.yte.pbs.entity.CustomEnumValue;
import com.yte.pbs.repository.CustomEnumTypeRepository;
import com.yte.pbs.repository.CustomEnumValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomEnumDataInitializer implements CommandLineRunner {

    private final CustomEnumTypeRepository typeRepository;
    private final CustomEnumValueRepository valueRepository;

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
                List.of()
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
                List.of()
        );

        initializeType(
                "WORK_TYPE",
                "Çalışma Türü",
                "GENERAL",
                6,
                List.of()
        );

        initializeType(
                "WORK_STATUS",
                "Çalışma Durumu",
                "GENERAL",
                7,
                List.of()
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
                List.of()
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
                List.of()
        );
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
