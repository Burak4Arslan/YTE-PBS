package com.yte.pbs.config;

import com.yte.pbs.entity.*;
import com.yte.pbs.repository.*;
import com.yte.pbs.service.UserProvisioningService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAuthorityAndUserData(
            AuthorityRepository authorityRepository,
            UserRepository userRepository,
            DirectoryEntryRepository directoryEntryRepository,
            ExperienceRepository experienceRepository,
            ContributionRepository contributionRepository,
            AttendanceRecordRepository attendanceRecordRepository,
            PasswordEncoder passwordEncoder,
            ProjectRepository projectRepository,
            PersonnelRepository personnelRepository,
            UserProjectRepository userProjectRepository,
            EducationRepository educationRepository,
            PersonnelHierarchyRepository personnelHierarchyRepository,
            UserProvisioningService userProvisioningService) {
        return args -> {
            Authority adminAuthority = findOrCreateAuthority(
                    authorityRepository, "ADMIN", "System administrator");
            findOrCreateAuthority(authorityRepository, "MANAGER", "Manager");
            findOrCreateAuthority(authorityRepository, "HR", "Human resources");
            Authority employeeAuthority = findOrCreateAuthority(
                    authorityRepository, "EMPLOYEE", "Employee");

            User adminUser = findOrCreateUser(
                    userRepository,
                    passwordEncoder,
                    "admin",
                    "Ahmet",
                    "Yilmaz",
                    "admin@pbs.com",
                    LocalDate.of(2019, 3, 4),
                    adminAuthority);

            User cenkUser = findOrCreateUser(
                    userRepository,
                    passwordEncoder,
                    "personel",
                    "Cenk",
                    "Çelik",
                    "cenk.celil@tubitak.gov.tr",
                    LocalDate.of(2023, 5, 15),
                    employeeAuthority);

            initializeAttendanceRecords(adminUser, cenkUser, attendanceRecordRepository);
            initializeExperiencesAndContributions(cenkUser, experienceRepository, contributionRepository);
            initializeEducations(cenkUser, educationRepository);
            initializeUserProjects(cenkUser, projectRepository, userProjectRepository);

            //General
            initializeDirectoryEntries(directoryEntryRepository);
            initializePersonnel(personnelRepository, userProvisioningService);
            initializePersonnelHierarchy(personnelHierarchyRepository);
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
            LocalDate employmentStartDate,
            Authority authority) {
        User user = userRepository.findByUsername(username).orElseGet(User::new);
        if (user.getId() == null) {
            user.setUsername(username);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("1"));
        }
        if (user.getEmploymentStartDate() == null) {
            user.setEmploymentStartDate(employmentStartDate);
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

    private void initializeAttendanceRecords(
            User adminUser,
            User cenkUser,
            AttendanceRecordRepository attendanceRecordRepository) {

        if (attendanceRecordRepository.findByUserIdOrderByAttendanceDateDescCheckInTimeDescIdDesc(adminUser.getId()).isEmpty()) {
            saveAttendanceRecord(attendanceRecordRepository, adminUser,
                    LocalDate.of(2023, 5, 15), LocalTime.of(9, 0), LocalTime.of(18, 0));
            saveAttendanceRecord(attendanceRecordRepository, adminUser,
                    LocalDate.of(2023, 5, 16), LocalTime.of(9, 10), LocalTime.of(18, 5));
            saveAttendanceRecord(attendanceRecordRepository, adminUser,
                    LocalDate.now().minusDays(1), LocalTime.of(9, 0), LocalTime.of(18, 0));
        }

        if (attendanceRecordRepository.findByUserIdOrderByAttendanceDateDescCheckInTimeDescIdDesc(cenkUser.getId()).isEmpty()) {
            saveAttendanceRecord(attendanceRecordRepository, cenkUser,
                    LocalDate.of(2023, 5, 15), LocalTime.of(8, 30), LocalTime.of(17, 30));
            saveAttendanceRecord(attendanceRecordRepository, cenkUser,
                    LocalDate.of(2023, 5, 16), LocalTime.of(8, 45), LocalTime.of(17, 40));
            saveAttendanceRecord(attendanceRecordRepository, cenkUser,
                    LocalDate.of(2023, 5, 17), LocalTime.of(8, 25), LocalTime.of(17, 20));
            saveAttendanceRecord(attendanceRecordRepository, cenkUser,
                    LocalDate.now().minusDays(1), LocalTime.of(8, 35), LocalTime.of(17, 35));
            saveAttendanceRecord(attendanceRecordRepository, cenkUser,
                    LocalDate.now().minusDays(2), LocalTime.of(8, 40), LocalTime.of(17, 30));
        }
    }

    private void saveAttendanceRecord(
            AttendanceRecordRepository attendanceRecordRepository,
            User user,
            LocalDate attendanceDate,
            LocalTime checkInTime,
            LocalTime checkOutTime) {
        AttendanceRecord attendanceRecord = new AttendanceRecord();
        attendanceRecord.setUser(user);
        attendanceRecord.setAttendanceDate(attendanceDate);
        attendanceRecord.setCheckInTime(checkInTime);
        attendanceRecord.setCheckOutTime(checkOutTime);
        attendanceRecordRepository.save(attendanceRecord);
    }

    private void initializeDirectoryEntries(DirectoryEntryRepository directoryEntryRepository) {
        // NOT: Burada eskiden koşulsuz bir deleteAll() vardı; bu, uygulama her
        // yeniden başlatıldığında admin panelinden eklenen gerçek personelin
        // rehber kayıtlarını da siliyordu. Diğer seed metodlarında olduğu gibi
        // artık her kayıt yalnızca daha önce yoksa ekleniyor.
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Ahmet Yılmaz", "Yazılım Geliştirme", "Kıdemli Mühendis",
                "Backend Geliştirme", "PBS", "admin@pbs.com", "0532 111 2233");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Fatima Demir", "Yazılım Geliştirme", "Mühendis",
                "Frontend Geliştirme", "PBS", "fatima.demir@yte.org", "0532 111 2234");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Mehmet Kaya", "Sistem Yönetimi", "Sistem Yöneticisi",
                "Veritabanı Yönetimi", "İnfrastruktur", "mehmet.kaya@yte.org", "0532 111 2235");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Ayşe Şimşek", "Yönetim", "Müdür",
                "Proje Yönetimi", "PBS", "ayse.simsek@yte.org", "0532 111 2236");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Elif Özkan", "QA", "Test Mühendisi",
                "Kalite Kontrol", "PBS", "elif.ozkan@yte.org", "0532 111 2237");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Cem Aydın", "Yazılım Geliştirme", "Mühendis",
                "API Geliştirme", "PBS", "cem.aydin@yte.org", "0532 111 2238");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Zeynep Koç", "UI/UX", "Tasarımcı",
                "Arayüz Tasarımı", "PBS", "zeynep.koc@yte.org", "0532 111 2239");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "İbrahim Tunç", "DevOps", "Mühendis",
                "Sunucu Yönetimi", "İnfrastruktur", "ibrahim.tunc@yte.org", "0532 111 2240");
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Cenk Çelik", "Yazılım Geliştirme", "Uzman Araştırmacı",
                "Ransomware Analiz Modülü", "PBS", "cenk.celil@tubitak.gov.tr", "0532 111 2241");
        // Admin panelinden eklendiği sırada rehber kaydı oluşturulamamış (eski
        // deleteAll() tarafından silinmiş) personelin kaydını geri ekliyoruz.
        createDirectoryEntryIfAbsent(directoryEntryRepository, "Elif Yildiz", "Yazılım Geliştirme", "Mühendis",
                "Backend Geliştirme", "PBS", "elif.yildiz@tubitak.yte.org", null);
    }

    private void createDirectoryEntryIfAbsent(
            DirectoryEntryRepository directoryEntryRepository,
            String fullName, String unit, String title, String duty, String project, String email, String phoneNumber) {
        if (directoryEntryRepository.findByEmail(email).isPresent()) {
            return;
        }
        directoryEntryRepository.save(new DirectoryEntry(fullName, unit, title, duty, project, email, phoneNumber));
    }


    private void initializeEducations(
            User user,
            EducationRepository educationRepository) {

        if (educationRepository.findByUserId(user.getId()).isEmpty()) {
            Education edu1 = new Education();
            edu1.setUserId(user.getId());
            edu1.setEducationType("Doktora");
            edu1.setSchoolName("Hacettepe Üniversitesi");
            edu1.setDepartment("Yazılım Mühendisliği");
            edu1.setStartDate(LocalDate.of(2020, 9, 12));
            edu1.setGraduationDate(LocalDate.of(2024, 6, 15));
            edu1.setDescription("Mikro Servisler, Prof.Dr.Yasemin Yıldız");
            educationRepository.save(edu1);

            Education edu2 = new Education();
            edu2.setUserId(user.getId());
            edu2.setEducationType("Lisans");
            edu2.setSchoolName("Hacettepe Üniversitesi");
            edu2.setDepartment("Yazılım Mühendisliği");
            edu2.setStartDate(LocalDate.of(2023, 1, 12));
            edu2.setGraduationDate(null);
            edu2.setDescription("Genel Akademik Not Ortalaması takibi");
            educationRepository.save(edu2);
        }
    }

    private Project findOrCreateProject(
            ProjectRepository projectRepository,
            String projectName,
            LocalDate beginDate,
            LocalDate endDate) {
        return projectRepository.findByProjectName(projectName)
                .orElseGet(() -> {
                    Project project = new Project();
                    project.setProjectName(projectName);
                    project.setBeginDate(beginDate);
                    project.setEndDate(endDate);
                    return projectRepository.save(project);
                });
    }

    private void initializeUserProjects(
            User user,
            ProjectRepository projectRepository,
            UserProjectRepository userProjectRepository) {

        Project eTedarik = findOrCreateProject(
                projectRepository, "E-Tedarik",
                LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31));
        Project pbs = findOrCreateProject(
                projectRepository, "Personel Bilgi Sistemi",
                LocalDate.of(2023, 1, 1), null);
        Project ransomware = findOrCreateProject(
                projectRepository, "Ransomware Analiz Modülü",
                LocalDate.of(2023, 1, 1), null);

        if (userProjectRepository.findByUserId(user.getId()).isEmpty()) {
            UserProject up1 = new UserProject();
            up1.setUserId(user.getId());
            up1.setProject(eTedarik);
            up1.setDuty("Backend Geliştirici");
            up1.setBeginDate(LocalDate.of(2023, 1, 1));
            up1.setEndDate(LocalDate.of(2023, 12, 31));
            userProjectRepository.save(up1);

            UserProject up2 = new UserProject();
            up2.setUserId(user.getId());
            up2.setProject(pbs);
            up2.setDuty("Takım Lideri");
            up2.setBeginDate(LocalDate.of(2024, 1, 15));
            up2.setEndDate(LocalDate.of(2025, 6, 30));
            userProjectRepository.save(up2);

            UserProject up3 = new UserProject();
            up3.setUserId(user.getId());
            up3.setProject(ransomware);
            up3.setDuty("Uzman Araştırmacı");
            up3.setBeginDate(LocalDate.of(2025, 7, 1));
            up3.setEndDate(LocalDate.of(2026, 3, 31));
            userProjectRepository.save(up3);
        }
    }


    private void initializePersonnel(
            PersonnelRepository personnelRepository, UserProvisioningService userProvisioningService) {

        Personnel adminPersonnel = personnelRepository.findByEmail("admin@pbs.com").orElse(null);
        if (adminPersonnel == null) {
            Personnel personnel = Personnel.builder()
                    .firstName("Ahmet")
                    .lastName("Yılmaz")
                    .tcIdentityNumber("10000000146")
                    .email("admin@pbs.com")
                    .gender("Erkek")
                    .academicTitle("Dr.")
                    .hireDate(LocalDate.of(2023, 4, 12))
                    .registrationNumber("PBS-0001")
                    .cadre("AG")
                    .title("Kıdemli Mühendis")
                    .personnelType("MARTEK")
                    .workType("Tam Zamanlı")
                    .workStatus("Aktif")
                    .department("Yazılım Geliştirme")
                    .duty("Backend Geliştirme")
                    .team("MDP-GE1")
                    .phoneNumber("0532 111 2233")
                    .birthDate(LocalDate.of(1995, 5, 12))
                    .roomNumber("216")
                    .build();
            adminPersonnel = personnelRepository.save(personnel);
        }
        // admin ve personel (Cenk) kullanıcıları zaten üstte findOrCreateUser ile
        // oluşturuldu; provisionForPersonnel aynı e-postayı görünce no-op yapar.
        userProvisioningService.provisionForPersonnel(adminPersonnel);

        // Rehber ve organizasyon şemasında görünen diğer kişilerin admin
        // Personel listesinde de tutarlı biçimde görünmesi için personnel
        // tablosuna karşılık gelen kayıtlarını ekliyoruz. Her biri için ayrıca
        // giriş yapabilecekleri bir kullanıcı hesabı da oluşturuluyor.
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "Fatima", "Demir", "10000000202",
                "fatima.demir@yte.org", "Kadın", LocalDate.of(2023, 6, 1), "PBS-0002", "Mühendis",
                "Mühendis", "Tam Zamanlı", "Ofis", "Aktif", "Yazılım Geliştirme", "Frontend Geliştirme",
                "PBS", "0532 111 2234", LocalDate.of(1997, 3, 22));
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "Mehmet", "Kaya", "10000000203",
                "mehmet.kaya@yte.org", "Erkek", LocalDate.of(2022, 2, 14), "PBS-0003", "Mühendis",
                "Sistem Yöneticisi", "Tam Zamanlı", "Ofis", "Aktif", "Sistem Yönetimi", "Veritabanı Yönetimi",
                "İnfrastruktur", "0532 111 2235", LocalDate.of(1990, 11, 8));
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "Ayşe", "Şimşek", "10000000204",
                "ayse.simsek@yte.org", "Kadın", LocalDate.of(2019, 9, 1), "PBS-0004", "İdari Personel",
                "Müdür", "Tam Zamanlı", "Ofis", "Aktif", "Yönetim", "Proje Yönetimi",
                "PBS", "0532 111 2236", LocalDate.of(1985, 4, 30));
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "Elif", "Özkan", "10000000205",
                "elif.ozkan@yte.org", "Kadın", LocalDate.of(2023, 1, 16), "PBS-0005", "Mühendis",
                "Test Mühendisi", "Tam Zamanlı", "Ofis", "Aktif", "QA", "Kalite Kontrol",
                "PBS", "0532 111 2237", LocalDate.of(1998, 7, 19));
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "Cem", "Aydın", "10000000206",
                "cem.aydin@yte.org", "Erkek", LocalDate.of(2023, 8, 21), "PBS-0006", "Mühendis",
                "Mühendis", "Tam Zamanlı", "Ofis", "Aktif", "Yazılım Geliştirme", "API Geliştirme",
                "PBS", "0532 111 2238", LocalDate.of(1999, 1, 5));
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "Zeynep", "Koç", "10000000207",
                "zeynep.koc@yte.org", "Kadın", LocalDate.of(2022, 11, 3), "PBS-0007", "Mühendis",
                "Tasarımcı", "Tam Zamanlı", "Ofis", "Aktif", "UI/UX", "Arayüz Tasarımı",
                "PBS", "0532 111 2239", LocalDate.of(1996, 9, 14));
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "İbrahim", "Tunç", "10000000208",
                "ibrahim.tunc@yte.org", "Erkek", LocalDate.of(2021, 5, 10), "PBS-0008", "Mühendis",
                "Mühendis", "Tam Zamanlı", "Ofis", "Aktif", "DevOps", "Sunucu Yönetimi",
                "İnfrastruktur", "0532 111 2240", LocalDate.of(1993, 12, 2));
        createPersonnelIfAbsent(personnelRepository, userProvisioningService, "Cenk", "Çelik", "10000000209",
                "cenk.celil@tubitak.gov.tr", "Erkek", LocalDate.of(2024, 3, 4), "PBS-0009", "Mühendis",
                "Uzman Araştırmacı", "Tam Zamanlı", "Ofis", "Aktif", "Yazılım Geliştirme", "Ransomware Analiz Modülü",
                "PBS", "0532 111 2241", LocalDate.of(1994, 6, 25));
    }

    private void createPersonnelIfAbsent(
            PersonnelRepository personnelRepository,
            UserProvisioningService userProvisioningService,
            String firstName, String lastName, String tcIdentityNumber,
            String email, String gender, LocalDate hireDate, String registrationNumber, String cadre,
            String title, String personnelType, String workType, String workStatus,
            String department, String duty, String projectWorkedOn, String phoneNumber, LocalDate birthDate) {

        Personnel existing = personnelRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            userProvisioningService.provisionForPersonnel(existing);
            return;
        }

        Personnel personnel = Personnel.builder()
                .firstName(firstName)
                .lastName(lastName)
                .tcIdentityNumber(tcIdentityNumber)
                .email(email)
                .gender(gender)
                .hireDate(hireDate)
                .registrationNumber(registrationNumber)
                .cadre(cadre)
                .title(title)
                .personnelType(personnelType)
                .workType(workType)
                .workStatus(workStatus)
                .department(department)
                .duty(duty)
                .projectWorkedOn(projectWorkedOn)
                .phoneNumber(phoneNumber)
                .birthDate(birthDate)
                .build();
        Personnel savedPersonnel = personnelRepository.save(personnel);
        userProvisioningService.provisionForPersonnel(savedPersonnel);
    }

    private static final long HIERARCHY_DIRECTOR_USER_ID = 9001L;

    private void initializePersonnelHierarchy(PersonnelHierarchyRepository personnelHierarchyRepository) {
        if (personnelHierarchyRepository.existsByUserId(HIERARCHY_DIRECTOR_USER_ID)) {
            return;
        }

        PersonnelHierarchy director = new PersonnelHierarchy();
        director.setUserId(HIERARCHY_DIRECTOR_USER_ID);
        director.setPersonnelName("Ayşe");
        director.setPersonnelSurname("Şimşek");
        director.setPersonnelJobTitle("Müdür (Yönetim / Proje Yönetimi)");
        personnelHierarchyRepository.save(director);

        PersonnelHierarchy yazilimGelistirmeLead = createHierarchySubordinate(personnelHierarchyRepository, director, 9002L,
                "Ahmet", "Yılmaz", "Kıdemli Mühendis (Backend)", "Yazılım Geliştirme");
        createHierarchySubordinate(personnelHierarchyRepository, yazilimGelistirmeLead, 9003L,
                "Fatima", "Demir", "Mühendis (Frontend)", "Yazılım Geliştirme");
        createHierarchySubordinate(personnelHierarchyRepository, yazilimGelistirmeLead, 9004L,
                "Cem", "Aydın", "Mühendis (API Geliştirme)", "Yazılım Geliştirme");
        createHierarchySubordinate(personnelHierarchyRepository, yazilimGelistirmeLead, 9005L,
                "Cenk", "Çelik", "Uzman Araştırmacı (Ransomware Analiz Modülü)", "Yazılım Geliştirme");

        createHierarchySubordinate(personnelHierarchyRepository, director, 9006L,
                "Mehmet", "Kaya", "Sistem Yöneticisi (Veritabanı Yönetimi / İnfrastruktur)", "Sistem Yönetimi");
        createHierarchySubordinate(personnelHierarchyRepository, director, 9007L,
                "Elif", "Özkan", "Test Mühendisi (Kalite Kontrol)", "QA");
        createHierarchySubordinate(personnelHierarchyRepository, director, 9008L,
                "Zeynep", "Koç", "Tasarımcı (Arayüz Tasarımı)", "UI/UX");
        createHierarchySubordinate(personnelHierarchyRepository, director, 9009L,
                "İbrahim", "Tunç", "Mühendis (Sunucu Yönetimi / İnfrastruktur)", "DevOps");
    }

    private PersonnelHierarchy createHierarchySubordinate(
            PersonnelHierarchyRepository personnelHierarchyRepository,
            PersonnelHierarchy superior,
            Long userId,
            String name,
            String surname,
            String jobTitle,
            String department) {
        PersonnelHierarchy subordinate = new PersonnelHierarchy();
        subordinate.setUserId(userId);
        subordinate.setPersonnelName(name);
        subordinate.setPersonnelSurname(surname);
        subordinate.setPersonnelJobTitle(jobTitle);
        subordinate.setDepartment(department);
        subordinate.setSuperiorPersonnel(superior);
        return personnelHierarchyRepository.save(subordinate);
    }
}
