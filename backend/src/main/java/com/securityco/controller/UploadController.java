package com.securityco.controller;

import com.securityco.service.MinioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/upload")
@RequiredArgsConstructor
public class UploadController {

    private final MinioService minioService;

    @PostMapping
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "vacancies") String folder
    ) {
        log.info("Upload request received. folder={}, filename={}, size={}, contentType={}",
                folder, file.getOriginalFilename(), file.getSize(), file.getContentType());

        if (file.isEmpty()) {
            log.warn("Upload rejected: empty file");
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }
        try {
            String objectName = minioService.uploadFile(file, folder);
            log.info("Upload successful: {}", objectName);
            return ResponseEntity.ok(Map.of("imageKey", objectName));
        } catch (Exception e) {
            log.error("Upload failed for folder={} filename={}", folder, file.getOriginalFilename(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
}
