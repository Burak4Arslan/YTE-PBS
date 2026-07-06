package com.yte.pbs.dto;

public record LoginRequest(
        String usernameOrEmail,
        String password) {}
