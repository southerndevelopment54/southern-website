package com.securityco.service;

import com.securityco.dto.LoginRequest;
import com.securityco.dto.LoginResponse;
import com.securityco.model.AdminUser;
import com.securityco.repository.AdminUserRepository;
import com.securityco.security.AdminUserDetailsService;
import com.securityco.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AdminUserDetailsService adminUserDetailsService;
    private final JwtService jwtService;
    private final AdminUserRepository adminUserRepository;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = adminUserDetailsService.loadUserByUsername(request.getUsername());
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        AdminUser admin = adminUserRepository.findByUsername(request.getUsername()).orElseThrow();
        admin.setLastLogin(LocalDateTime.now());
        adminUserRepository.save(admin);

        return new LoginResponse(accessToken, refreshToken, 900);
    }
}
