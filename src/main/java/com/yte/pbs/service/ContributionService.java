package com.yte.pbs.service;

import com.yte.pbs.dto.ContributionDto;
import com.yte.pbs.entity.Contribution;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.ContributionRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContributionService {

    private final ContributionRepository contributionRepository;
    private final UserRepository userRepository;

    public ContributionService(ContributionRepository contributionRepository, UserRepository userRepository) {
        this.contributionRepository = contributionRepository;
        this.userRepository = userRepository;
    }

    public List<ContributionDto> getContributionsByUser(Long userId) {
        return contributionRepository.findByUserId(userId).stream()
                .map(con -> new ContributionDto(con.getId(), con.getEventType(), con.getDescription(),
                        con.getLink(), con.getAttachedFilePath(), con.getUploadDate()))
                .collect(Collectors.toList());
    }

    public ContributionDto addContribution(Long userId, ContributionDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        Contribution contribution = new Contribution();
        updateContributionFields(contribution, dto);
        contribution.setUser(user);

        Contribution saved = contributionRepository.save(contribution);
        return new ContributionDto(saved.getId(), saved.getEventType(), saved.getDescription(),
                saved.getLink(), saved.getAttachedFilePath(), saved.getUploadDate());
    }

    public ContributionDto editContribution(Long conId, ContributionDto dto) {
        Contribution contribution = contributionRepository.findById(conId)
                .orElseThrow(() -> new RuntimeException("Contribution entry not found"));

        updateContributionFields(contribution, dto);
        Contribution updated = contributionRepository.save(contribution);
        return new ContributionDto(updated.getId(), updated.getEventType(), updated.getDescription(),
                updated.getLink(), updated.getAttachedFilePath(), updated.getUploadDate());
    }

    public void deleteContribution(Long conId) {
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