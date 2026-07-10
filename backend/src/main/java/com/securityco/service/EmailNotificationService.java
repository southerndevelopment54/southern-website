package com.securityco.service;

import com.securityco.model.AdminUser;
import com.securityco.model.ApplicantSubmission;
import com.securityco.model.ContactMessage;
import com.securityco.model.NotificationRecipient;
import com.securityco.model.VacancyInquiry;
import com.securityco.repository.AdminUserRepository;
import com.securityco.repository.NotificationRecipientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final NotificationRecipientRepository notificationRecipientRepository;
    private final AdminUserRepository adminUserRepository;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${NOTIFICATION_FROM:noreply@southern-services.example.com}")
    private String notificationFrom;

    @Async
    public void notifyNewJobApplication(ApplicantSubmission submission, String vacancyTitle, String vacancyLocation, String vacancySalary) {
        if (submission == null) return;

        String subject = "職位空缺申請";
        StringBuilder body = new StringBuilder();
        body.append("收到一則新的職位空缺申請。\n\n");
        body.append("職位名稱：").append(nullSafe(vacancyTitle)).append("\n");
        body.append("地點：").append(nullSafe(vacancyLocation)).append("\n");
        body.append("薪金：").append(nullSafe(vacancySalary)).append("\n\n");
        body.append("申請人姓名：").append(submission.getFirstName()).append(" ").append(submission.getLastName()).append("\n");
        body.append("電話：").append(nullSafe(submission.getPhoneNumber())).append("\n");
        body.append("電郵：").append(nullSafe(submission.getEmail())).append("\n");
        if (submission.getYearsOfExperience() != null) {
            body.append("工作經驗年資：").append(submission.getYearsOfExperience()).append(" 年\n");
        }
        body.append("持有保安牌照：").append(Boolean.TRUE.equals(submission.getHasSecurityLicense()) ? "是" : "否").append("\n");
        if (submission.getLicenseNumber() != null && !submission.getLicenseNumber().isBlank()) {
            body.append("牌照號碼：").append(submission.getLicenseNumber()).append("\n");
        }
        if (submission.getMessage() != null && !submission.getMessage().isBlank()) {
            body.append("\n訊息：\n").append(submission.getMessage()).append("\n");
        }

        sendToAdmins(subject, body.toString());
    }

    @Async
    public void notifyNewContactInquiry(ContactMessage message) {
        if (message == null) return;

        String subject = "客戶服務查詢";
        StringBuilder body = new StringBuilder();
        body.append("收到一則新的客戶服務查詢。\n\n");
        body.append("姓名：").append(nullSafe(message.getName())).append("\n");
        body.append("公司：").append(nullSafe(message.getCompany())).append("\n");
        body.append("電話：").append(nullSafe(message.getPhone())).append("\n");
        body.append("電郵：").append(nullSafe(message.getEmail())).append("\n");
        body.append("服務類型：").append(nullSafe(message.getServiceType())).append("\n");
        body.append("\n查詢內容：\n").append(nullSafe(message.getMessage())).append("\n");

        sendToAdmins(subject, body.toString());
    }

    @Async
    public void notifyNewVacancyInquiry(VacancyInquiry inquiry) {
        if (inquiry == null) return;

        String subject = "更多職位空缺查詢";
        StringBuilder body = new StringBuilder();
        body.append("收到一則新的更多職位空缺查詢。\n\n");
        body.append("姓名：").append(inquiry.getFirstName()).append(" ").append(inquiry.getLastName()).append("\n");
        body.append("電話：").append(nullSafe(inquiry.getPhone())).append("\n");
        body.append("電郵：").append(nullSafe(inquiry.getEmail())).append("\n");
        if (inquiry.getYearsOfExperience() != null) {
            body.append("工作經驗年資：").append(inquiry.getYearsOfExperience()).append(" 年\n");
        }
        if (inquiry.getLicenseNumber() != null && !inquiry.getLicenseNumber().isBlank()) {
            body.append("牌照號碼：").append(inquiry.getLicenseNumber()).append("\n");
        }
        body.append("服務類型：").append(nullSafe(inquiry.getServiceType())).append("\n");
        body.append("偏好地區：").append(nullSafe(inquiry.getDistrictPreference())).append("\n");
        if (inquiry.getMessage() != null && !inquiry.getMessage().isBlank()) {
            body.append("\n訊息：\n").append(inquiry.getMessage()).append("\n");
        }

        sendToAdmins(subject, body.toString());
    }

    private void sendToAdmins(String subject, String body) {
        List<String> recipients = notificationRecipientRepository.findByIsActiveTrue()
                .stream()
                .map(NotificationRecipient::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .distinct()
                .toList();

        if (recipients.isEmpty()) {
            recipients = adminUserRepository.findByIsActiveTrueAndEmailIsNotNull()
                    .stream()
                    .map(AdminUser::getEmail)
                    .filter(email -> email != null && !email.isBlank())
                    .distinct()
                    .toList();
        }

        if (recipients.isEmpty() && adminEmail != null && !adminEmail.isBlank()) {
            recipients = List.of(adminEmail);
        }

        if (recipients.isEmpty()) {
            log.warn("No admin recipients configured. Skipping email notification. Subject: {}", subject);
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("JavaMailSender is not configured. Skipping email notification. Subject: {}", subject);
            return;
        }

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(notificationFrom);
            msg.setTo(recipients.toArray(new String[0]));
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Email notification sent to {} recipient(s). Subject: {}", recipients.size(), subject);
        } catch (MailException e) {
            log.error("Failed to send email notification. Subject: {}", subject, e);
        }
    }

    private String nullSafe(String value) {
        return value != null && !value.isBlank() ? value : "—";
    }
}
