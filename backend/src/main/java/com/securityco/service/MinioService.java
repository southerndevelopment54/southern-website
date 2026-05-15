package com.securityco.service;

import com.securityco.config.MinioConfig;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    public String uploadFile(MultipartFile file, String folder) throws Exception {
        String bucket = minioConfig.getBucketName();
        log.info("Uploading file to MinIO. Bucket={}, folder={}, filename={}", bucket, folder, file.getOriginalFilename());

        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
        log.debug("Bucket exists: {}", exists);
        if (!exists) {
            log.info("Creating bucket: {}", bucket);
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }

        String objectName = folder + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        log.info("Storing object: {}", objectName);

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );
        log.info("Upload successful: {}", objectName);
        return objectName;
    }

    public String getPresignedUrl(String objectName) throws Exception {
        String url = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(minioConfig.getBucketName())
                        .object(objectName)
                        .expiry(7, TimeUnit.DAYS)
                        .build()
        );
        if (minioConfig.getExternalEndpoint() != null && !minioConfig.getExternalEndpoint().isBlank()) {
            url = url.replace(minioConfig.getEndpoint(), minioConfig.getExternalEndpoint());
        }
        return url;
    }

    public byte[] getObjectBytes(String objectName) throws Exception {
        try (var stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .object(objectName)
                        .build())) {
            return stream.readAllBytes();
        }
    }

    public String getPublicUrl(String objectName) {
        if (objectName == null || objectName.isBlank()) return null;
        return "/api/files/" + objectName;
    }
}
