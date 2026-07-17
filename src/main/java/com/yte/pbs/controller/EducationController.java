package com.yte.pbs.controller;

import com.yte.pbs.entity.Education;
import com.yte.pbs.repository.EducationRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.yte.pbs.security.SecurityUtils;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/educations")
public class EducationController {

    private final UserRepository userRepository;
    private final EducationRepository educationRepository;

    public EducationController(UserRepository userRepository, EducationRepository educationRepository) {
        this.userRepository = userRepository;
        this.educationRepository = educationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Education>> getUserEducations(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(educationRepository.findByUserId(user.getId())))
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @PostMapping
    public ResponseEntity<?> addEducation(@RequestParam String email, @RequestBody Education educationInput) {
        var userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            var user = userOptional.get();
            SecurityUtils.verifyOwnership(user.getId());
            educationInput.setUserId(user.getId());

            Education savedEducation = educationRepository.save(educationInput);
            return ResponseEntity.ok(savedEducation);
        }

        return ResponseEntity.badRequest().body("Eğitim eklenemedi: Kullanıcı bulunamadı.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEducation(@PathVariable Long id, @RequestBody Education educationInput) {
        return educationRepository.findById(id)
                .map(existingEducation -> {
                    SecurityUtils.verifyOwnership(existingEducation.getUserId());
                    existingEducation.setEducationType(educationInput.getEducationType());
                    existingEducation.setSchoolName(educationInput.getSchoolName());
                    existingEducation.setDepartment(educationInput.getDepartment());
                    existingEducation.setStartDate(educationInput.getStartDate());
                    existingEducation.setGraduationDate(educationInput.getGraduationDate());
                    existingEducation.setDescription(educationInput.getDescription());

                    Education updatedEducation = educationRepository.save(existingEducation);
                    return ResponseEntity.ok(updatedEducation);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEducation(@PathVariable Long id) {
        return educationRepository.findById(id).map(education -> {
            SecurityUtils.verifyOwnership(education.getUserId());
            educationRepository.deleteById(id);
            return ResponseEntity.ok().body("Eğitim kaydı başarıyla silindi.");
        }).orElse(ResponseEntity.notFound().build());
    }
}