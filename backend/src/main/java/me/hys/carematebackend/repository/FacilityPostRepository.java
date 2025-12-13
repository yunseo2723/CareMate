package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.community.FacilityBoardType;
import me.hys.carematebackend.model.community.FacilityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FacilityPostRepository extends JpaRepository<FacilityPost, Long> {

    @Query("""
        select p
        from FacilityPost p
        where p.writer.id = :userId
          and p.boardType = 'REVIEW'
        order by p.createdAt desc
    """)
    List<FacilityPost> findMyReviews(@Param("userId") Long userId);

    List<FacilityPost> findByInstCodeAndKindCodeAndBoardTypeOrderByCreatedAtDesc(String instCode, String kindCode, FacilityBoardType type);
    Optional<FacilityPost> findByIdAndInstCodeAndKindCode(Long id, String instCode, String kindCode);

}
