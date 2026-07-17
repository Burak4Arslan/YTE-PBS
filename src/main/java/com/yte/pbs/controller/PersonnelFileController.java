package com.yte.pbs.controller;

import com.yte.pbs.entity.PersonnelFile;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.PersonnelFileRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/files")
public class PersonnelFileController {

    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;

    private static final Set<String> ALLOWED_FILE_TYPES = Set.of(
            "CV",
            "Sertifika",
            "Diploma",
            "Kimlik Belgesi",
            "Diğer"
    );

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
    public ResponseEntity<?> getUserFiles(@RequestParam String email) {
        var targetUser = userRepository.findByEmail(email.trim());

        if (targetUser.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        ensureCanAccess(targetUser.get().getId());

        List<PersonnelFile> files =
                personnelFileRepository.findByUserIdOrderByCreatedAtDesc(
                        targetUser.get().getId()
                );

        return ResponseEntity.ok(files);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(
            @RequestParam String email,
            @RequestParam String fileType,
            @RequestPart("file") MultipartFile file
    ) {
        var targetUser = userRepository.findByEmail(email.trim());

        if (targetUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Kullanıcı bulunamadı.");
        }

        ensureCanAccess(targetUser.get().getId());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Dosya seçilmedi.");
        }

        String normalizedFileType =
                fileType == null ? "" : fileType.trim();

        if (!ALLOWED_FILE_TYPES.contains(normalizedFileType)) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Geçersiz dosya türü.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Dosya en fazla 10 MB olabilir.");
        }

        String safeFileName = sanitizeFileName(file.getOriginalFilename());

        if (safeFileName.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Dosya adı geçersiz.");
        }

        if (safeFileName.length() > 255) {
            return ResponseEntity.badRequest()
                    .body("Dosya yüklenemedi: Dosya adı çok uzun.");
        }

        try {
            PersonnelFile personnelFile = new PersonnelFile();

            personnelFile.setUserId(targetUser.get().getId());
            personnelFile.setFileType(normalizedFileType);
            personnelFile.setFileName(safeFileName);
            personnelFile.setContentType(
                    normalizeContentType(file.getContentType())
            );
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
        PersonnelFile personnelFile = personnelFileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Dosya bulunamadı."
                ));

        ensureCanAccess(personnelFile.getUserId());

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.parseMediaType(
                        normalizeContentType(personnelFile.getContentType())
                )
        );

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
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        PersonnelFile personnelFile = personnelFileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Dosya bulunamadı."
                ));

        ensureCanAccess(personnelFile.getUserId());

        personnelFileRepository.delete(personnelFile);

        return ResponseEntity.ok("Dosya başarıyla silindi.");
    }

    private void ensureCanAccess(Long targetUserId) {
        User authenticatedUser = currentUser();

        if (authenticatedUser.getId().equals(targetUserId) || isAdmin()) {
            return;
        }

        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Bu kullanıcının dosyalarına erişim yetkiniz yok."
        );
    }

    private User currentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Oturum bulunamadı."
            );
        }

        String usernameOrEmail = authentication.getName();

        return userRepository
                .findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Oturum kullanıcısı bulunamadı."
                ));
    }

    private boolean isAdmin() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication != null
                && authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        "ROLE_ADMIN".equals(authority.getAuthority())
                );
    }

    private String sanitizeFileName(String originalFileName) {
        if (originalFileName == null) {
            return "";
        }

        String normalized = originalFileName.replace('\\', '/').trim();
        int lastSlashIndex = normalized.lastIndexOf('/');

        if (lastSlashIndex >= 0) {
            normalized = normalized.substring(lastSlashIndex + 1);
        }

        return normalized.trim();
    }

    private String normalizeContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        try {
            return MediaType.parseMediaType(contentType).toString();
        } catch (IllegalArgumentException exception) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }
}
