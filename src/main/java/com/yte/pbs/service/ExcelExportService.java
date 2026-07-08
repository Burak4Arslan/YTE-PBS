package com.yte.pbs.service;

import com.yte.pbs.entity.Personnel;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelExportService {

    public ByteArrayInputStream exportPersonnelToExcel(List<Personnel> personnelList) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Personel Raporu");

            // Header
            String[] headers = {
                    "Ad", "Soyad", "Sicil No", "Kadro", "Unvan", "Birim",
                    "Çalışılan Proje", "Görev", "Personel Türü", "Çalışma Türü", "Çalışma Durumu", "Akademik Unvan"
            };

            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            int rowIdx = 1;
            for (Personnel p : personnelList) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getFirstName() != null ? p.getFirstName() : "");
                row.createCell(1).setCellValue(p.getLastName() != null ? p.getLastName() : "");
                row.createCell(2).setCellValue(p.getRegistrationNumber() != null ? p.getRegistrationNumber() : "");
                row.createCell(3).setCellValue(p.getCadre() != null ? p.getCadre() : "");
                row.createCell(4).setCellValue(p.getTitle() != null ? p.getTitle() : "");
                row.createCell(5).setCellValue(p.getDepartment() != null ? p.getDepartment() : "");
                row.createCell(6).setCellValue(p.getProjectWorkedOn() != null ? p.getProjectWorkedOn() : "");
                row.createCell(7).setCellValue(p.getDuty() != null ? p.getDuty() : "");
                row.createCell(8).setCellValue(p.getPersonnelType() != null ? p.getPersonnelType() : "");
                row.createCell(9).setCellValue(p.getWorkType() != null ? p.getWorkType() : "");
                row.createCell(10).setCellValue(p.getWorkStatus() != null ? p.getWorkStatus() : "");
                row.createCell(11).setCellValue(p.getAcademicTitle() != null ? p.getAcademicTitle() : "");
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Excel dosyası oluşturulurken hata oluştu: " + e.getMessage());
        }
    }
}
