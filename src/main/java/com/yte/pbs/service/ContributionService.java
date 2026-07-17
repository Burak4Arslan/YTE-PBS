package com.yte.pbs.service;

import com.yte.pbs.dto.ContributionDto;
import com.yte.pbs.entity.Contribution;
import com.yte.pbs.repository.ContributionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.yte.pbs.security.SecurityUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContributionService {

    private final ContributionRepository contributionRepository;

    public ContributionService(ContributionRepository contributionRepository) {
        this.contributionRepository = contributionRepository;
    }

    public List<ContributionDto> getContributionsByUser(Long userId) {
        return contributionRepository.findByUserId(userId).stream()
                .map(con -> new ContributionDto(
                        con.getId(),
                        con.getUserId(),
                        con.getEventType(),
                        con.getDescription(),
                        con.getLink(),
                        con.getAttachedFilePath(),
                        con.getUploadDate()
                ))
                .collect(Collectors.toList());
    }

    public ContributionDto addContribution(Long userId, ContributionDto dto) {
        SecurityUtils.verifyOwnership(userId);
        Contribution contribution = new Contribution();
        updateContributionFields(contribution, dto);
        contribution.setUserId(userId);

        Contribution saved = contributionRepository.save(contribution);
        return new ContributionDto(
                saved.getId(),
                saved.getUserId(),
                saved.getEventType(),
                saved.getDescription(),
                saved.getLink(),
                saved.getAttachedFilePath(),
                saved.getUploadDate()
        );
    }

    public ContributionDto editContribution(Long conId, ContributionDto dto) {
        Contribution contribution = contributionRepository.findById(conId)
                .orElseThrow(() -> new RuntimeException("Contribution entry not found"));

        SecurityUtils.verifyOwnership(contribution.getUserId());
        updateContributionFields(contribution, dto);
        Contribution updated = contributionRepository.save(contribution);
        return new ContributionDto(
                updated.getId(),
                updated.getUserId(),
                updated.getEventType(),
                updated.getDescription(),
                updated.getLink(),
                updated.getAttachedFilePath(),
                updated.getUploadDate()
        );
    }

    public void deleteContribution(Long conId) {
        Contribution contribution = contributionRepository.findById(conId)
                .orElseThrow(() -> new RuntimeException("Contribution entry not found"));
        SecurityUtils.verifyOwnership(contribution.getUserId());
        contributionRepository.deleteById(conId);
    }

    private void updateContributionFields(Contribution target, ContributionDto source) {
        target.setEventType(source.eventType());
        target.setDescription(source.description());
        target.setLink(source.link());
        target.setAttachedFilePath(source.attachedFilePath());
        target.setUploadDate(source.uploadDate());
    }
}