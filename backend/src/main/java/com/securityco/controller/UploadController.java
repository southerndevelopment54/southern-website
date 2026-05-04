package com.securityco.controller;

import com.securityco.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/upload")
@RequiredArgsConstructor
public class UploadController {

    private final MinioService minioService;

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "vacancies") String folder
    ) {
        String objectName = minioService.uploadFile(file, folder);
        return ResponseEntity.ok(Map.of("imageKey", objectName));
    }
}
