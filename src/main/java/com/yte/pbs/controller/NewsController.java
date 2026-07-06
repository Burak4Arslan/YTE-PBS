package com.yte.pbs.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/news")
@CrossOrigin("*")
public class NewsController {

    @GetMapping
    public List<Map<String, Object>> getAllNews() {
        Map<String, Object> news1 = new HashMap<>();
        news1.put("id", 1);
        news1.put("imageUrl", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600");
        news1.put("content",
                "BİLGEM TechTalks alanımızda Kurumsal Yönetişim Derneği işbirliği ile gerçekleştireceğimiz #ProjeYönetişimi temalı etkinliğimize davetlisiniz 📣");

        return Collections.singletonList(news1);
    }
}