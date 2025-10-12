package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Entity
@Getter @Setter
@Table(name = "admin_phone_otp")
public class AdminPhoneOtp {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long careMateId;
    private String destPhone;
    private String codeHash;
    private Instant expiresAt;
    private int attempts = 0;
    private String status = "PENDING";

    public void incAttempts(){ this.attempts++; }
    public void markVerified(){ this.status = "VERIFIED"; }
}
