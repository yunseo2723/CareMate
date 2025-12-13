package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.community.FacilityBoardType;
import me.hys.carematebackend.model.community.FacilityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacilityPostRepository extends JpaRepository<FacilityPost, Long> {
    List<FacilityPost> findByInstCodeAndKindCodeAndBoardTypeOrderByCreatedAtDesc(String instCode, String kindCode, FacilityBoardType type);
    Optional<FacilityPost> findByIdAndInstCodeAndKindCode(Long id, String instCode, String kindCode);

}
