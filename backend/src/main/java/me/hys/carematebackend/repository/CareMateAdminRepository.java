package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.CareMateAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CareMateAdminRepository extends JpaRepository<CareMateAdmin, Long> {
    boolean existsByUserIdAndCareMateId(Long userId, Long careMateId);

    @Query(value = "insert ignore into caremate_admins (user_id, caremate_id, created_at) values (?1, ?2, now())", nativeQuery = true)
    void createIfNotExists(Long userId, Long careMateId);
}
