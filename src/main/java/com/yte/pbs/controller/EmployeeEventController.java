package com.yte.pbs.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin("*")
public class EmployeeEventController {

    @GetMapping
    public List<Map<String, Object>> getAllEvents() {
        List<Map<String, Object>> eventList = new ArrayList<>();

        // 1. Örnek: Bu Ay Doğanlar için Veri
        Map<String, Object> event1 = new HashMap<>();
        event1.put("id", 1);
        event1.put("fullName", "Ahmet Bulut");
        event1.put("profileImageUrl", "https://randomuser.me/api/portraits/men/32.jpg");
        event1.put("eventDate", "2026-06-10");
        event1.put("eventType", "BIRTHDAY");
        eventList.add(event1);

        // 2. Örnek: Aramıza Hoşgeldin için Veri
        Map<String, Object> event2 = new HashMap<>();
        event2.put("id", 2);
        event2.put("fullName", "Ahmet Bulut");
        event2.put("profileImageUrl", "https://randomuser.me/api/portraits/men/32.jpg");
        event2.put("eventDate", "2026-07-10");
        event2.put("eventType", "WELCOME");
        eventList.add(event2);

        return eventList;
    }
}