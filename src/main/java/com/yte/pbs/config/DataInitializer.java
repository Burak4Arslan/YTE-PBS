package com.yte.pbs.config;

import com.yte.pbs.entity.Authority;
import com.yte.pbs.entity.DirectoryEntry;
import com.yte.pbs.entity.User;
import com.yte.pbs.entity.Experience;
import com.yte.pbs.entity.Contribution;
import com.yte.pbs.repository.AuthorityRepository;
import com.yte.pbs.repository.DirectoryEntryRepository;
import com.yte.pbs.repository.UserRepository;
import com.yte.pbs.repository.ExperienceRepository;
import com.yte.pbs.repository.ContributionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAuthorityAndUserData(
            AuthorityRepository authorityRepository,
            UserRepository userRepository,
            DirectoryEntryRepository directoryEntryRepository,
            ExperienceRepository experienceRepository,
            ContributionRepository contributionRepository,
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

            User cenkUser = findOrCreateUser(
                    userRepository,
                    passwordEncoder,
                    "personel",
                    "Cenk",
                    "Çelik",
                    "cenk.celil@tubitak.gov.tr",
                    employeeAuthority);

            initializeExperiencesAndContributions(cenkUser, experienceRepository, contributionRepository);

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

    private User findOrCreateUser(
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
            user.setPassword(passwordEncoder.encode("1"));
        }
        if (!user.getAuthorities().contains(authority)) {
            user.getAuthorities().add(authority);
        }
        return userRepository.save(user);
    }

    private void initializeExperiencesAndContributions(
            User user,
            ExperienceRepository experienceRepository,
            ContributionRepository contributionRepository) {

        if (experienceRepository.findByUserId(user.getId()).isEmpty()) {
            Experience exp1 = new Experience();
            exp1.setWorkPlace("TÜBİTAK BİLGEM");
            exp1.setRole("Uzman Araştırmacı");
            exp1.setWorkType("Tam Zamanlı");
            exp1.setStartDate(LocalDate.of(2020, 8, 15));
            exp1.setEndDate(LocalDate.of(2023, 4, 10));
            exp1.setReasonOfLeave("Yeni bir kurumsal dijital dönüşüm projesinde yöneticilik teklifi değerlendirildi.");
            exp1.setUserId(user.getId());
            experienceRepository.save(exp1);

            Experience exp2 = new Experience();
            exp2.setWorkPlace("Hacettepe Üniversitesi Teknokent");
            exp2.setRole("Yazılım Mühendisi");
            exp2.setWorkType("Yarı Zamanlı");
            exp2.setStartDate(LocalDate.of(2018, 10, 1));
            exp2.setEndDate(LocalDate.of(2020, 7, 30));
            exp2.setReasonOfLeave("Yüksek lisans mezuniyeti sonrası tam zamanlı araştırma kadrosuna geçiş.");
            exp2.setUserId(user.getId());
            experienceRepository.save(exp2);
        }

        if (contributionRepository.findByUserId(user.getId()).isEmpty()) {
            Contribution con1 = new Contribution();
            con1.setEventType("Konferans Sunumu");
            con1.setDescription("Ulusal Dijital Dönüşüm Zirvesi kapsamında 'Kamu Kurumlarında Yapay Zeka Stratejileri' başlıklı sunum başarıyla gerçekleştirildi.");
            con1.setLink("https://dijitaldonusumzirvesi.org.tr/ozet/cenk-celik");
            con1.setAttachedFilePath("/uploads/contributions/kamu_yz_sunum_2025.pdf");
            con1.setUploadDate(LocalDate.of(2025, 11, 14));
            con1.setUserId(user.getId());
            contributionRepository.save(con1);

            Contribution con2 = new Contribution();
            con2.setEventType("Teknik Rapor / Whitepaper");
            con2.setDescription("Meteoroloji Genel Müdürlüğü (MGM) Entegrasyonu Mimari Değerlendirme Raporu hazırlanarak üst yönetime sunuldu.");
            con2.setLink("");
            con2.setAttachedFilePath("/uploads/contributions/mgm_mimari_rapor_v2.pdf");
            con2.setUploadDate(LocalDate.of(2026, 2, 3));
            con2.setUserId(user.getId());
            contributionRepository.save(con2);
        }
    }

    private void initializeDirectoryEntries(DirectoryEntryRepository directoryEntryRepository) {
        directoryEntryRepository.deleteAll();
        directoryEntryRepository.save(new DirectoryEntry(
                "Ahmet Yılmaz", "Yazılım Geliştirme", "Kıdemli Mühendis",
                "Backend Geliştirme", "PBS", "admin@pbs.com", "0532 111 2233"));
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
