package com.yte.pbs.controller;

import com.yte.pbs.dto.CustomEnumTypeDto;
import com.yte.pbs.dto.CustomEnumValueDto;
import com.yte.pbs.service.CustomEnumService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custom-enums")
@RequiredArgsConstructor
public class CustomEnumController {

    private final CustomEnumService customEnumService;

    @GetMapping
    public List<CustomEnumTypeDto> getAllTypes() {
        return customEnumService.getAllTypes();
    }

    @GetMapping("/{code}/values")
    public List<CustomEnumValueDto> getActiveValues(@PathVariable String code) {
        return customEnumService.getValues(code, false);
    }
}
