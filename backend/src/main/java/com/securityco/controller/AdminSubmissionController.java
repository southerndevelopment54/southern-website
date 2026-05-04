package com.securityco.controller;

import com.securityco.dto.SubmissionResponse;
import com.securityco.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/submissions")
@RequiredArgsConstructor
public class AdminSubmissionController {

    private final SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<Page<SubmissionResponse>> listAll(Pageable pageable) {
        return ResponseEntity.ok(submissionService.listSubmissions(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(submissionService.getSubmission(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SubmissionResponse> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return ResponseEntity.ok(submissionService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }
}
