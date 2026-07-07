package com.yte.pbs.service;

import com.yte.pbs.entity.Personnel;
import com.yte.pbs.repository.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonnelService {

    private final PersonnelRepository personnelRepository;

    public Personnel addPersonnel(Personnel personnel) {
        // T.C. Kimlik numarası sistemde var mı kontrolü eklenebilir
        if (personnelRepository.findByTcIdentityNumber(personnel.getTcIdentityNumber()).isPresent()) {
            throw new RuntimeException("Bu T.C. Kimlik Numarası ile zaten bir personel kayıtlı!");
        }
        return personnelRepository.save(personnel);
    }
}