package com.yte.pbs.service;

import com.yte.pbs.dto.UserAuthorityDto;
import com.yte.pbs.dto.UpdateUserAuthoritiesRequest;
import com.yte.pbs.entity.Authority;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.AuthorityRepository;
import com.yte.pbs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class UserAuthorityService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;

    public List<UserAuthorityDto> getAllUsersAuthorities() {
        return userRepository.findByAuthorizationListedTrueOrderByIdAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserAuthorityDto> getRegisteredUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private UserAuthorityDto toDto(User user) {
        List<String> frontendRoles = user.getAuthorities().stream()
                .map(auth -> mapBackendToFrontendRole(auth.getName()))
                .filter(role -> role != null)
                .collect(Collectors.toList());

        return UserAuthorityDto.builder()
                .id(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .roles(frontendRoles)
                .build();
    }

    @Transactional
    public void updateUserAuthorities(UpdateUserAuthoritiesRequest request) {
        if (request == null || request.getUsers() == null) return;

        Map<String, Authority> authorityMap = authorityRepository.findAll().stream()
                .collect(Collectors.toMap(Authority::getName, auth -> auth));

        for (UserAuthorityDto userDto : request.getUsers()) {
            userRepository.findById(userDto.getId()).ifPresent(user -> {
                Set<Authority> newAuthorities = new HashSet<>();
                if (userDto.getRoles() != null) {
                    for (String frontendRole : userDto.getRoles()) {
                        String backendRole = mapFrontendToBackendRole(frontendRole);
                        if (backendRole != null && authorityMap.containsKey(backendRole)) {
                            newAuthorities.add(authorityMap.get(backendRole));
                        }
                    }
                }
                user.setRoles(newAuthorities);
                user.setAuthorizationListed(true);
                userRepository.save(user);
            });
        }
    }

    private String mapBackendToFrontendRole(String backendRole) {
        switch (backendRole) {
            case "EMPLOYEE": return "Standart Kullanıcı";
            case "HR": return "Yetkili Kullanıcı";
            case "MANAGER": return "Süper Kullanıcı";
            case "ADMIN": return "Admin";
            default: return null;
        }
    }

    private String mapFrontendToBackendRole(String frontendRole) {
        switch (frontendRole) {
            case "Standart Kullanıcı": return "EMPLOYEE";
            case "Yetkili Kullanıcı": return "HR";
            case "Süper Kullanıcı": return "MANAGER";
            case "Admin": return "ADMIN";
            default: return null;
        }
    }
}
