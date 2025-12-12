package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.FacilityAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityAdminRepository extends JpaRepository<FacilityAdmin, Long> {

    List<FacilityAdmin> findByInstCode(String instCode);

    boolean existsByUserIdAndInstCode(Long userId, String instCode);

    List<FacilityAdmin> findByUserId(Long userId);
}
