package com.securityco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SecurityCoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecurityCoApplication.class, args);
    }
}
