package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByEmail(String email);
    void deleteByEmail(String email);
    void deleteAllByExpiryBefore(LocalDateTime time);
}

