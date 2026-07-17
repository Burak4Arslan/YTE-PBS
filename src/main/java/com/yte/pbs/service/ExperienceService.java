package com.yte.pbs.service;

import com.yte.pbs.dto.ExperienceDto;
import com.yte.pbs.entity.Experience;
import com.yte.pbs.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.yte.pbs.security.SecurityUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    public List<ExperienceDto> getExperiencesByUser(Long userId) {
        return experienceRepository.findByUserId(userId).stream()
                .map(exp -> new ExperienceDto(exp.getId(), exp.getUserId(), exp.getWorkPlace(), exp.getRole(),
                        exp.getWorkType(), exp.getStartDate(), exp.getEndDate(), exp.getReasonOfLeave()))
                .collect(Collectors.toList());
    }

    public ExperienceDto addExperience(Long userId, ExperienceDto dto) {
        SecurityUtils.verifyOwnership(userId);
        Experience experience = new Experience();
        updateExperienceFields(experience, dto);
        experience.setUserId(userId);

        Experience saved = experienceRepository.save(experience);
        return new ExperienceDto(saved.getId(), saved.getUserId(), saved.getWorkPlace(), saved.getRole(),
                saved.getWorkType(), saved.getStartDate(), saved.getEndDate(), saved.getReasonOfLeave());
    }

    public ExperienceDto editExperience(Long expId, ExperienceDto dto) {
        Experience experience = experienceRepository.findById(expId)
                .orElseThrow(() -> new RuntimeException("Experience entry not found"));

        SecurityUtils.verifyOwnership(experience.getUserId());
        updateExperienceFields(experience, dto);
        Experience updated = experienceRepository.save(experience);
        return new ExperienceDto(updated.getId(), updated.getUserId(), updated.getWorkPlace(), updated.getRole(),
                updated.getWorkType(), updated.getStartDate(), updated.getEndDate(), updated.getReasonOfLeave());
    }

    public void deleteExperience(Long expId) {
        Experience experience = experienceRepository.findById(expId)
                .orElseThrow(() -> new RuntimeException("Experience entry not found"));
        SecurityUtils.verifyOwnership(experience.getUserId());
        experienceRepository.deleteById(expId);
    }

    private void updateExperienceFields(Experience target, ExperienceDto source) {
        target.setWorkPlace(source.workPlace());
        target.setRole(source.role());
        target.setWorkType(source.workType());
        target.setStartDate(source.startDate());
        target.setEndDate(source.endDate());
        target.setReasonOfLeave(source.reasonOfLeave());
    }
}