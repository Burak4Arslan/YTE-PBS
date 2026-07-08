package com.yte.pbs.config;

import com.yte.pbs.entity.Personnel;
import com.yte.pbs.repository.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final PersonnelRepository personnelRepository;

    @Override
    public void run(String... args) throws Exception {
        if (personnelRepository.count() == 0) {
            System.out.println("Veritabanı boş, örnek veriler yükleniyor...");

            Personnel p1 = Personnel.builder()
                    .firstName("Cemre")
                    .lastName("Çelik")
                    .tcIdentityNumber("12345678901")
                    .email("cemre.celik@example.com")
                    .gender("Kadın")
                    .academicTitle("Dr.")
                    .hireDate(LocalDate.of(2020, 5, 15))
                    .registrationNumber("000000")
                    .cadre("AG")
                    .title("Araştırmacı")
                    .personnelType("MARTEK")
                    .workType("Tam Zamanlı")
                    .workStatus("Aktif")
                    .department("Dijital Strateji")
                    .duty("İş Analisti")
                    .team("Yazılım")
                    .projectWorkedOn("TENMAK")
                    .educationType("Lisans")
                    .graduationDepartment("Bilgisayar Mühendisliği")
                    .contribution("Makale")
                    .build();

            Personnel p2 = Personnel.builder()
                    .firstName("Kemal")
                    .lastName("Yılmaz")
                    .tcIdentityNumber("10987654321")
                    .email("kemal.yilmaz@example.com")
                    .gender("Erkek")
                    .academicTitle("Prof. Dr.")
                    .hireDate(LocalDate.of(2018, 8, 20))
                    .registrationNumber("000001")
                    .cadre("AG")
                    .title("Uzman")
                    .personnelType("MARTEK")
                    .workType("Yarı Zamanlı")
                    .workStatus("Aktif")
                    .department("Dijital Strateji")
                    .duty("Yazılım Geliştirici")
                    .team("Yazılım")
                    .projectWorkedOn("TENMAK")
                    .educationType("Yüksek Lisans")
                    .graduationDepartment("Bilgisayar Mühendisliği")
                    .contribution("Proje")
                    .build();

            Personnel p3 = Personnel.builder()
                    .firstName("Ayşe")
                    .lastName("Demir")
                    .tcIdentityNumber("11111111111")
                    .email("ayse.demir@example.com")
                    .gender("Kadın")
                    .academicTitle("")
                    .hireDate(LocalDate.of(2015, 1, 10))
                    .leaveDate(LocalDate.of(2023, 12, 31))
                    .registrationNumber("000002")
                    .cadre("Uzman Yardımcısı")
                    .title("Araştırmacı")
                    .personnelType("Kamu")
                    .workType("Tam Zamanlı")
                    .workStatus("Ayrıldı")
                    .department("İnsan Kaynakları")
                    .duty("İK Uzmanı")
                    .team("İdari")
                    .projectWorkedOn("İç Destek")
                    .educationType("Lisans")
                    .graduationDepartment("İşletme")
                    .contribution("Yok")
                    .build();

            personnelRepository.saveAll(List.of(p1, p2, p3));
            System.out.println("Örnek personeller başarıyla eklendi.");
        }
    }
}
