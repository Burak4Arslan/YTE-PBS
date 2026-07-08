package com.yte.pbs.service;

import com.yte.pbs.dto.CustomEnumTypeDto;
import com.yte.pbs.dto.CustomEnumValueDto;
import com.yte.pbs.dto.CustomEnumValueRequest;
import com.yte.pbs.entity.CustomEnumType;
import com.yte.pbs.entity.CustomEnumValue;
import com.yte.pbs.repository.CustomEnumTypeRepository;
import com.yte.pbs.repository.CustomEnumValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomEnumService {

    private final CustomEnumTypeRepository typeRepository;
    private final CustomEnumValueRepository valueRepository;

    public List<CustomEnumTypeDto> getAllTypes() {
        return typeRepository.findAllByOrderBySortOrderAscIdAsc()
                .stream()
                .map(this::toTypeDto)
                .toList();
    }

    public List<CustomEnumValueDto> getValues(String code, boolean includeInactive) {
        CustomEnumType type = getTypeByCode(code);

        List<CustomEnumValue> values = includeInactive
                ? valueRepository.findByType_IdOrderBySortOrderAscIdAsc(type.getId())
                : valueRepository.findByType_IdAndActiveTrueOrderBySortOrderAscIdAsc(type.getId());

        return values.stream()
                .map(this::toValueDto)
                .toList();
    }

    @Transactional
    public CustomEnumValueDto addValue(String code, CustomEnumValueRequest request) {
        CustomEnumType type = getTypeByCode(code);
        String normalizedValue = normalizeValue(request == null ? null : request.value());

        CustomEnumValue existing = valueRepository
                .findByType_IdAndValueIgnoreCase(type.getId(), normalizedValue)
                .orElse(null);

        if (existing != null) {
            if (existing.isActive()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Bu seçenek zaten mevcut."
                );
            }

            existing.setActive(true);
            existing.setSortOrder(resolveSortOrder(type.getId(), request.sortOrder()));
            return toValueDto(valueRepository.save(existing));
        }

        CustomEnumValue value = new CustomEnumValue();
        value.setType(type);
        value.setValue(normalizedValue);
        value.setSortOrder(resolveSortOrder(type.getId(), request.sortOrder()));
        value.setActive(true);

        return toValueDto(valueRepository.save(value));
    }

    @Transactional
    public List<CustomEnumValueDto> addValues(String code, List<String> rawValues) {
        if (rawValues == null || rawValues.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "En az bir seçenek gönderilmelidir."
            );
        }

        Set<String> requestDuplicates = new HashSet<>();
        List<CustomEnumValueDto> addedValues = new ArrayList<>();

        for (String rawValue : rawValues) {
            String normalizedValue = normalizeValue(rawValue);
            String duplicateKey = normalizedValue.toLowerCase(Locale.ROOT);

            if (!requestDuplicates.add(duplicateKey)) {
                continue;
            }

            addedValues.add(addValue(
                    code,
                    new CustomEnumValueRequest(normalizedValue, null)
            ));
        }

        return addedValues;
    }

    @Transactional
    public CustomEnumValueDto updateValue(Long valueId, CustomEnumValueRequest request) {
        CustomEnumValue value = getValueById(valueId);
        String normalizedValue = normalizeValue(request == null ? null : request.value());

        valueRepository
                .findByType_IdAndValueIgnoreCase(value.getType().getId(), normalizedValue)
                .filter(existing -> !existing.getId().equals(valueId))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Bu seçenek zaten mevcut."
                    );
                });

        value.setValue(normalizedValue);

        if (request.sortOrder() != null) {
            validateSortOrder(request.sortOrder());
            value.setSortOrder(request.sortOrder());
        }

        return toValueDto(valueRepository.save(value));
    }

    @Transactional
    public void deactivateValue(Long valueId) {
        CustomEnumValue value = getValueById(valueId);
        value.setActive(false);
        valueRepository.save(value);
    }

    @Transactional
    public List<CustomEnumValueDto> reorderValues(String code, List<Long> valueIds) {
        CustomEnumType type = getTypeByCode(code);
        List<CustomEnumValue> currentValues =
                valueRepository.findByType_IdOrderBySortOrderAscIdAsc(type.getId());

        if (valueIds == null || valueIds.size() != currentValues.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Sıralama listesi tüm seçenekleri içermelidir."
            );
        }

        Set<Long> currentIds = currentValues.stream()
                .map(CustomEnumValue::getId)
                .collect(java.util.stream.Collectors.toSet());

        Set<Long> requestedIds = new HashSet<>(valueIds);

        if (requestedIds.size() != valueIds.size() || !requestedIds.equals(currentIds)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Sıralama listesinde geçersiz veya tekrar eden seçenek var."
            );
        }

        java.util.Map<Long, CustomEnumValue> valuesById = currentValues.stream()
                .collect(java.util.stream.Collectors.toMap(
                        CustomEnumValue::getId,
                        value -> value
                ));

        for (int index = 0; index < valueIds.size(); index++) {
            valuesById.get(valueIds.get(index)).setSortOrder(index + 1);
        }

        return valueRepository.saveAll(currentValues)
                .stream()
                .sorted(java.util.Comparator
                        .comparing(CustomEnumValue::getSortOrder)
                        .thenComparing(CustomEnumValue::getId))
                .map(this::toValueDto)
                .toList();
    }

    private CustomEnumType getTypeByCode(String code) {
        if (code == null || code.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enum kodu boş olamaz."
            );
        }

        return typeRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Custom enum türü bulunamadı."
                ));
    }

    private CustomEnumValue getValueById(Long valueId) {
        if (valueId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Seçenek kimliği boş olamaz."
            );
        }

        return valueRepository.findById(valueId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Custom enum seçeneği bulunamadı."
                ));
    }

    private String normalizeValue(String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Seçenek değeri boş olamaz."
            );
        }

        String normalizedValue = rawValue.trim();

        if (normalizedValue.length() > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Seçenek değeri 200 karakterden uzun olamaz."
            );
        }

        return normalizedValue;
    }

    private int resolveSortOrder(Long typeId, Integer requestedSortOrder) {
        if (requestedSortOrder != null) {
            validateSortOrder(requestedSortOrder);
            return requestedSortOrder;
        }

        return valueRepository.findByType_IdOrderBySortOrderAscIdAsc(typeId)
                .stream()
                .map(CustomEnumValue::getSortOrder)
                .filter(java.util.Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0) + 1;
    }

    private void validateSortOrder(Integer sortOrder) {
        if (sortOrder < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Sıra numarası 1 veya daha büyük olmalıdır."
            );
        }
    }

    private CustomEnumTypeDto toTypeDto(CustomEnumType type) {
        return new CustomEnumTypeDto(
                type.getId(),
                type.getCode(),
                type.getDisplayName(),
                type.getCategory(),
                type.getSortOrder()
        );
    }

    private CustomEnumValueDto toValueDto(CustomEnumValue value) {
        return new CustomEnumValueDto(
                value.getId(),
                value.getType().getId(),
                value.getValue(),
                value.getSortOrder(),
                value.isActive()
        );
    }
}
