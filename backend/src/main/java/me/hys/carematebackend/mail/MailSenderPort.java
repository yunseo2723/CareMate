package me.hys.carematebackend.mail;

public interface MailSenderPort {
    void send(String to, String subject, String plain, String html);
}
