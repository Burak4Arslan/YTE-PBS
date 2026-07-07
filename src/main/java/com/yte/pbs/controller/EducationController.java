package com.yte.pbs.controller;

import com.yte.pbs.entity.Education;
import com.yte.pbs.repository.EducationRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            educationInput.setUserId(user.getId());

            Education savedEducation = educationRepository.save(educationInput);
            return ResponseEntity.ok(savedEducation);
        }

        return ResponseEntity.badRequest().body("Eğitim eklenemedi: Kullanıcı bulunamadı.");
    }
}