package com.yte.pbs.service;

import com.yte.pbs.dto.CustomEnumValueDto;
import com.yte.pbs.dto.CustomEnumValueRequest;
import com.yte.pbs.repository.CustomEnumTypeRepository;
import com.yte.pbs.repository.CustomEnumValueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CustomEnumServiceTest {

    @Autowired
    private CustomEnumService customEnumService;

    @Autowired
    private CustomEnumTypeRepository typeRepository;

    @Autowired
    private CustomEnumValueRepository valueRepository;

    @BeforeEach
    void cleanSchoolValues() {
        typeRepository.findByCodeIgnoreCase("SCHOOL")
                .ifPresent(type ->
                        valueRepository.deleteAll(
                                valueRepository.findByType_IdOrderBySortOrderAscIdAsc(type.getId())
                        )
                );
    }

    @Test
    void shouldAddValue() {
        CustomEnumValueDto created = customEnumService.addValue(
                "SCHOOL",
                new CustomEnumValueRequest("ODTÜ", null)
        );

        assertNotNull(created.id());
        assertEquals("ODTÜ", created.value());
        assertEquals(1, created.sortOrder());
        assertTrue(created.active());
    }

    @Test
    void shouldRejectDuplicateValueIgnoringCase() {
        customEnumService.addValue(
                "SCHOOL",
                new CustomEnumValueRequest("ODTÜ", null)
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> customEnumService.addValue(
                        "SCHOOL",
                        new CustomEnumValueRequest("odtü", null)
                )
        );

        assertEquals(409, exception.getStatusCode().value());
    }

    @Test
    void shouldSoftDeleteValue() {
        CustomEnumValueDto created = customEnumService.addValue(
                "SCHOOL",
                new CustomEnumValueRequest("ODTÜ", null)
        );

        customEnumService.deactivateValue(created.id());

        List<CustomEnumValueDto> activeValues =
                customEnumService.getValues("SCHOOL", false);

        List<CustomEnumValueDto> allValues =
                customEnumService.getValues("SCHOOL", true);

        assertTrue(activeValues.isEmpty());
        assertEquals(1, allValues.size());
        assertFalse(allValues.getFirst().active());
    }

    @Test
    void shouldBulkAddValues() {
        List<CustomEnumValueDto> added = customEnumService.addValues(
                "SCHOOL",
                List.of("ODTÜ", "Bilkent Üniversitesi")
        );

        assertEquals(2, added.size());
        assertEquals("ODTÜ", added.get(0).value());
        assertEquals("Bilkent Üniversitesi", added.get(1).value());
        assertEquals(1, added.get(0).sortOrder());
        assertEquals(2, added.get(1).sortOrder());
    }

    @Test
    void shouldReorderValues() {
        List<CustomEnumValueDto> added = customEnumService.addValues(
                "SCHOOL",
                List.of("ODTÜ", "Bilkent Üniversitesi")
        );

        Long odtuId = added.get(0).id();
        Long bilkentId = added.get(1).id();

        List<CustomEnumValueDto> reordered =
                customEnumService.reorderValues(
                        "SCHOOL",
                        List.of(bilkentId, odtuId)
                );

        assertEquals("Bilkent Üniversitesi", reordered.get(0).value());
        assertEquals(1, reordered.get(0).sortOrder());

        assertEquals("ODTÜ", reordered.get(1).value());
        assertEquals(2, reordered.get(1).sortOrder());
    }
}
