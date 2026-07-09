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
import java.util.ArrayList;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class UserAuthorityService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;

    public List<UserAuthorityDto> getAllUsersAuthorities() {
        return userRepository.findAll().stream().map(user -> {
            List<String> frontendRoles = user.getAuthorities().stream()
                    .map(auth -> mapBackendToFrontendRole(auth.getName()))
                    .filter(role -> role != null)
                    .collect(Collectors.toList());
            
            return UserAuthorityDto.builder()
                    .id(user.getId())
                    .name(user.getFirstName() + " " + user.getLastName())
                    .roles(frontendRoles)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateUserAuthorities(UpdateUserAuthoritiesRequest request) {
        if (request == null || request.getUsers() == null) return;

        Map<String, Authority> authorityMap = authorityRepository.findAll().stream()
                .collect(Collectors.toMap(Authority::getName, auth -> auth));

        for (UserAuthorityDto userDto : request.getUsers()) {
            // New users might have negative or null ID in a real system, but our mock sends Date.now()
            // Wait, we shouldn't create users here, only update existing ones.
            // If the user doesn't exist, we can ignore or throw an error.
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
