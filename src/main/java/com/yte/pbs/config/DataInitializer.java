package com.yte.pbs.config;

import com.yte.pbs.entity.Authority;
import com.yte.pbs.entity.DirectoryEntry;
import com.yte.pbs.entity.User;
import com.yte.pbs.repository.AuthorityRepository;
import com.yte.pbs.repository.DirectoryEntryRepository;
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
            DirectoryEntryRepository directoryEntryRepository,
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

            // Initialize directory entries
            initializeDirectoryEntries(directoryEntryRepository);
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

    private void initializeDirectoryEntries(DirectoryEntryRepository directoryEntryRepository) {
        directoryEntryRepository.deleteAll();
        directoryEntryRepository.save(new DirectoryEntry(
                "Ahmet Yılmaz", "Yazılım Geliştirme", "Kıdemli Mühendis",
                "Backend Geliştirme", "PBS", "ahmet.yilmaz@yte.org", "0532 111 2233"));
        directoryEntryRepository.save(new DirectoryEntry(
                "Fatima Demir", "Yazılım Geliştirme", "Mühendis",
                "Frontend Geliştirme", "PBS", "fatima.demir@yte.org", "0532 111 2234"));
        directoryEntryRepository.save(new DirectoryEntry(
                "Mehmet Kaya", "Sistem Yönetimi", "Sistem Yöneticisi",
                "Veritabanı Yönetimi", "İnfrastruktur", "mehmet.kaya@yte.org", "0532 111 2235"));
        directoryEntryRepository.save(new DirectoryEntry(
                "Ayşe Şimşek", "Yönetim", "Müdür",
                "Proje Yönetimi", "PBS", "ayse.simsek@yte.org", "0532 111 2236"));
        directoryEntryRepository.save(new DirectoryEntry(
                "Elif Özkan", "QA", "Test Mühendisi",
                "Kalite Kontrol", "PBS", "elif.ozkan@yte.org", "0532 111 2237"));
        directoryEntryRepository.save(new DirectoryEntry(
                "Cem Aydın", "Yazılım Geliştirme", "Mühendis",
                "API Geliştirme", "PBS", "cem.aydin@yte.org", "0532 111 2238"));
        directoryEntryRepository.save(new DirectoryEntry(
                "Zeynep Koç", "UI/UX", "Tasarımcı",
                "Arayüz Tasarımı", "PBS", "zeynep.koc@yte.org", "0532 111 2239"));
        directoryEntryRepository.save(new DirectoryEntry(
                "İbrahim Tunç", "DevOps", "Mühendis",
                "Sunucu Yönetimi", "İnfrastruktur", "ibrahim.tunc@yte.org", "0532 111 2240"));
    }
}
