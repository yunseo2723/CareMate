package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.community.FacilityComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityCommentRepository extends JpaRepository<FacilityComment, Long> {
    List<FacilityComment> findByPostIdOrderByCreatedAtAsc(Long postId);

    Long countByPostId(Long postId);
}
