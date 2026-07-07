package com.yte.pbs.controller;

import com.yte.pbs.entity.PersonnelFile;
import com.yte.pbs.repository.PersonnelFileRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class PersonnelFileController {

    private final PersonnelFileRepository personnelFileRepository;
    private final UserRepository userRepository;

    public PersonnelFileController(
            PersonnelFileRepository personnelFileRepository,
            UserRepository userRepository
    ) {
        this.personnelFileRepository = personnelFileRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getUserFiles(@RequestParam Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }

        List<PersonnelFile> files =
                personnelFileRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return ResponseEntity.ok(files);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(
            @RequestParam Long userId,
            @RequestParam String fileType,
            @RequestPart("file") MultipartFile file
    ) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Kullanıcı bulunamadı.");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Dosya seçilmedi.");
        }

        if (fileType == null || fileType.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Dosya türü seçilmedi.");
        }

        try {
            PersonnelFile personnelFile = new PersonnelFile();

            personnelFile.setUserId(userId);
            personnelFile.setFileType(fileType);
            personnelFile.setFileName(file.getOriginalFilename());
            personnelFile.setContentType(file.getContentType());
            personnelFile.setFileSize(file.getSize());
            personnelFile.setFileData(file.getBytes());

            PersonnelFile savedFile =
                    personnelFileRepository.save(personnelFile);

            return ResponseEntity.ok(savedFile);

        } catch (IOException exception) {
            return ResponseEntity.internalServerError()
                    .body("Dosya yüklenirken bir hata oluştu.");
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        return personnelFileRepository.findById(id)
                .map(personnelFile -> {
                    HttpHeaders headers = new HttpHeaders();

                    String contentType = personnelFile.getContentType();

                    if (contentType == null || contentType.isBlank()) {
                        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                    } else {
                        headers.setContentType(
                                MediaType.parseMediaType(contentType)
                        );
                    }

                    headers.setContentDisposition(
                            ContentDisposition.attachment()
                                    .filename(
                                            personnelFile.getFileName(),
                                            StandardCharsets.UTF_8
                                    )
                                    .build()
                    );

                    headers.setContentLength(personnelFile.getFileSize());

                    return ResponseEntity.ok()
                            .headers(headers)
                            .body(personnelFile.getFileData());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        if (!personnelFileRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        personnelFileRepository.deleteById(id);

        return ResponseEntity.ok("Dosya başarıyla silindi.");
    }
}
