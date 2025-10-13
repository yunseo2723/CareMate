package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.CareMateAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface CareMateAdminRepository extends JpaRepository<CareMateAdmin, Long> {
    boolean existsByUserIdAndCareMateId(Long userId, Long careMateId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "insert ignore into caremate_admins (user_id, care_mate_id, created_at) values (?1, ?2, now())",
            nativeQuery = true)
    int insertIgnore(Long userId, Long careMateId);
}

