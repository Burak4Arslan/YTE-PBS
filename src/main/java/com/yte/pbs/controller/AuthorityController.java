package com.yte.pbs.controller;

import com.yte.pbs.entity.Authority;
import com.yte.pbs.repository.AuthorityRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/authorities")
public class AuthorityController {

    private final AuthorityRepository authorityRepository;

    public AuthorityController(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    @GetMapping
    public List<Authority> getAllAuthorities() {
        return authorityRepository.findAll();
    }
}
