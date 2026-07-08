package com.yte.pbs.controller;

import com.yte.pbs.dto.CustomEnumBulkValueRequest;
import com.yte.pbs.dto.CustomEnumOrderRequest;
import com.yte.pbs.dto.CustomEnumValueDto;
import com.yte.pbs.dto.CustomEnumValueRequest;
import com.yte.pbs.service.CustomEnumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/panel/custom-enums")
@RequiredArgsConstructor
public class PanelCustomEnumController {

    private final CustomEnumService customEnumService;

    @GetMapping("/{code}/values")
    public List<CustomEnumValueDto> getAllValues(@PathVariable String code) {
        return customEnumService.getValues(code, true);
    }

    @PostMapping("/{code}/values")
    public CustomEnumValueDto addValue(
            @PathVariable String code,
            @RequestBody CustomEnumValueRequest request) {
        return customEnumService.addValue(code, request);
    }

    @PostMapping("/{code}/values/bulk")
    public List<CustomEnumValueDto> addValues(
            @PathVariable String code,
            @RequestBody CustomEnumBulkValueRequest request) {
        return customEnumService.addValues(
                code,
                request == null ? null : request.values()
        );
    }

    @PutMapping("/values/{valueId}")
    public CustomEnumValueDto updateValue(
            @PathVariable Long valueId,
            @RequestBody CustomEnumValueRequest request) {
        return customEnumService.updateValue(valueId, request);
    }

    @DeleteMapping("/values/{valueId}")
    public ResponseEntity<Void> deactivateValue(@PathVariable Long valueId) {
        customEnumService.deactivateValue(valueId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{code}/values/order")
    public List<CustomEnumValueDto> reorderValues(
            @PathVariable String code,
            @RequestBody CustomEnumOrderRequest request) {
        return customEnumService.reorderValues(
                code,
                request == null ? null : request.valueIds()
        );
    }
}
