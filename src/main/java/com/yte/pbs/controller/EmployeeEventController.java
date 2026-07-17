package com.yte.pbs.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.yte.pbs.repository.PersonnelRepository;
import com.yte.pbs.entity.Personnel;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
@RestController
@RequestMapping("/api/events")
@CrossOrigin("*")
public class EmployeeEventController {

    @Autowired
    private PersonnelRepository personnelRepository;

    @GetMapping
    public List<Map<String, Object>> getAllEvents() {
        List<Map<String, Object>> eventList = new ArrayList<>();
        List<Personnel> personnelList = personnelRepository.findAll();
        
        LocalDate today = LocalDate.now();
        Month currentMonth = today.getMonth();

        for (Personnel p : personnelList) {
            if (p.getBirthDate() != null) {
                if (p.getBirthDate().getMonth() == currentMonth) {
                    Map<String, Object> event = new HashMap<>();
                    event.put("id", p.getId());
                    event.put("fullName", (p.getFirstName() + " " + p.getLastName()).trim());
                    event.put("profileImageUrl", p.getPhotoUrl());
                    event.put("eventDate", p.getBirthDate().toString());
                    event.put("eventType", "BIRTHDAY");
                    eventList.add(event);
                }
            }
        }

        return eventList;
    }
}