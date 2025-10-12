package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.AdminPhoneOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Optional;

public interface AdminPhoneOtpRepository extends JpaRepository<AdminPhoneOtp, Long> {

    @Query("select o from AdminPhoneOtp o where o.userId=?1 and o.careMateId=?2 and o.status='PENDING'")
    Optional<AdminPhoneOtp> findActive(Long userId, Long careMateId);

    default void saveOrUpdate(Long userId, Long careMateId, String dest, String codeHash, Instant expires){
        var exist = findActive(userId, careMateId);
        AdminPhoneOtp otp = exist.orElse(new AdminPhoneOtp());
        otp.setUserId(userId);
        otp.setCareMateId(careMateId);
        otp.setDestPhone(dest);
        otp.setCodeHash(codeHash);
        otp.setExpiresAt(expires);
        otp.setStatus("PENDING");
        save(otp);
    }
}
