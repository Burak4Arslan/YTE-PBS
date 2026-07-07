package com.yte.pbs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "personnel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- GENEL BÖLÜMÜ ---
    @Column(nullable = false)
    private String firstName; // Ad*

    @Column(nullable = false)
    private String lastName; // Soyad*

    @Column(nullable = false, unique = true, length = 11)
    private String tcIdentityNumber; // T.C. Kimlik Numarası*

    private String email; // E-posta

    @Column(nullable = false)
    private String gender; // Cinsiyet*

    private String academicTitle; // Akademik Unvan

    @Column(nullable = false)
    private LocalDate hireDate; // İşe Giriş Tarihi*

    private String registrationNumber; // Sicil No

    @Column(nullable = false)
    private String cadre; // Kadro*

    @Column(nullable = false)
    private String title; // Unvan*

    @Column(nullable = false)
    private String personnelType; // Personel Türü*

    @Column(nullable = false)
    private String workType; // Çalışma Türü*

    @Column(nullable = false)
    private String workStatus; // Çalışma Durumu*

    @Column(nullable = false)
    private String department; // Birim*

    @Column(nullable = false)
    private String duty; // Görevi*

    private String team; // Takım
    private String projectWorkedOn; // Çalışılan Proje
    private String mentor; // Mentor
    private String shuttleUsage; // Servis Kullanımı

    // --- DİĞER BÖLÜMÜ ---
    private String residentialAddress; // İkametgah Adresi
    private String phoneNumber; // Telefon
    private LocalDate birthDate; // Doğum Tarihi
    private String extensionNumber; // Dahili Numara
    private String roomNumber; // Oda Numara
    private String licensePlate; // Araç Plakası
    private String bloodType; // Kan Grubu
    private String emergencyContactPerson; // Acil Durumda Ulaşılacak Kişi
    private String emergencyContactPhone; // Acil Durumda Ulaşılacak Kişi Tel
    private String photoUrl; // Fotoğraf (Dosya yolu veya Base64 olarak tutulabilir)
}