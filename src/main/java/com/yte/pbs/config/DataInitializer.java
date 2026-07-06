package com.yte.pbs.config;

import com.yte.pbs.entity.Authority;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.AuthorityRepository;
import com.yte.pbs.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAuthorityAndUserData(
            AuthorityRepository authorityRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            Authority adminAuthority = findOrCreateAuthority(
                    authorityRepository, "ADMIN", "System administrator");
            findOrCreateAuthority(authorityRepository, "MANAGER", "Manager");
            findOrCreateAuthority(authorityRepository, "HR", "Human resources");
            Authority employeeAuthority = findOrCreateAuthority(
                    authorityRepository, "EMPLOYEE", "Employee");

            findOrCreateUser(
                    userRepository,
                    passwordEncoder,
                    "admin",
                    "Ahmet",
                    "Yilmaz",
                    "admin@pbs.com",
                    adminAuthority);
            findOrCreateUser(
                    userRepository,
                    passwordEncoder,
                    "personel",
                    "Mehmet",
                    "Demir",
                    "personel@pbs.com",
                    employeeAuthority);
        };
    }

    private Authority findOrCreateAuthority(
            AuthorityRepository authorityRepository,
            String name,
            String description) {
        return authorityRepository.findByName(name)
                .orElseGet(() -> authorityRepository.save(new Authority(name, description)));
    }

    private void findOrCreateUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String username,
            String firstName,
            String lastName,
            String email,
            Authority authority) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        if (user.getId() == null) {
            user.setUsername(username);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("Password123*"));
        }
        user.getAuthorities().add(authority);
        userRepository.save(user);
    }
}
