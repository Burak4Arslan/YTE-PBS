package com.yte.pbs.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/news")
@CrossOrigin("*")
public class NewsController {

    @GetMapping
    public List<Map<String, Object>> getAllNews() {
        List<Map<String, Object>> newsList = new ArrayList<>();

        // 1. Haber
        Map<String, Object> news1 = new HashMap<>();
        news1.put("id", 1);
        news1.put("imageUrl", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600");
        news1.put("content",
                "BİLGEM TechTalks alanımızda Kurumsal Yönetişim Derneği işbirliği ile gerçekleştireceğimiz #ProjeYönetişimi temalı etkinliğimize davetlisiniz 📣");
        newsList.add(news1);

        // 2. Haber
        Map<String, Object> news2 = new HashMap<>();
        news2.put("id", 2);
        news2.put("imageUrl", "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600");
        news2.put("content",
                "Siber Güvenlik Haftası Etkinlikleri: MITRE ATT&CK framework'ü ve zero-day zafiyetleri üzerine düzenlenecek olan workshop'a kayıtlar başlamıştır. 🛡️");
        newsList.add(news2);

        // 3. Haber
        Map<String, Object> news3 = new HashMap<>();
        news3.put("id", 3);
        news3.put("imageUrl", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600");
        news3.put("content",
                "2026 Yılı 'a Yetenek' kurumsal yaz stajı programı kapsamında aramıza yeni katılan mühendis adaylarımıza başarılar dileriz! 🚀");
        newsList.add(news3);

        return newsList;
    }
}