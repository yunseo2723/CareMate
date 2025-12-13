package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.community.PostDetailDto;
import me.hys.carematebackend.dto.community.ReviewDetailDto;
import me.hys.carematebackend.dto.community.ReviewDto;
import me.hys.carematebackend.dto.community.ReviewListDto;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.model.community.FacilityBoardType;
import me.hys.carematebackend.model.community.FacilityPost;
import me.hys.carematebackend.repository.FacilityPostRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final FacilityPostRepository postRepository;

    /** 리뷰 작성 */
    public void createReview(String instCode, String kindCode, ReviewDto req, User user
    ) {
        FacilityPost post = FacilityPost.builder()
                .instCode(instCode)
                .kindCode(kindCode)
                .boardType(FacilityBoardType.REVIEW)
                .title(req.getTitle())
                .content(req.getContent())
                .rating(req.getRating())
                .writer(user)
                .viewCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        postRepository.save(post);
    }

    public List<ReviewListDto> getReviews(String instCode, String kindCode) {
        return postRepository
                .findByInstCodeAndKindCodeAndBoardTypeOrderByCreatedAtDesc(instCode, kindCode, FacilityBoardType.REVIEW)
                .stream()
                .map(p -> new ReviewListDto(
                        p.getId(),
                        p.getTitle(),
                        p.getRating(),
                        p.getWriter().getName(),
                        p.getCreatedAt(),
                        p.getViewCount()
                ))
                .toList();
    }

    /** 리뷰 상세 (+ 조회수 증가) */
    public ReviewDetailDto detailReview(Long id, String instCode, String kindCode) {
        FacilityPost p = postRepository.findByIdAndInstCodeAndKindCode(id, instCode, kindCode)
                .orElseThrow(() -> new RuntimeException("리뷰 없음"));

        p.setViewCount(p.getViewCount() + 1);
        postRepository.save(p);

        return new ReviewDetailDto(
                p.getId(),
                p.getTitle(),
                p.getContent(),
                p.getRating(),
                p.getWriter().getName(),
                p.getCreatedAt(),
                p.getViewCount()
        );
    }

    /** 리뷰 수정 */
    public void updateReview(Long id, String instCode, String kindCode, ReviewDto req, User user
    ) {
        FacilityPost p = postRepository.findByIdAndInstCodeAndKindCode(id, instCode, kindCode)
                .orElseThrow(() -> new RuntimeException("리뷰 없음"));

        if (!p.getWriter().getId().equals(user.getId()))
            throw new AccessDeniedException("권한 없음");

        p.setTitle(req.getTitle());
        p.setContent(req.getContent());
        p.setRating(req.getRating());
        p.setUpdatedAt(LocalDateTime.now());

        postRepository.save(p);
    }

    /** 리뷰 삭제 */
    public void deleteReview(Long id, String instCode, String kindCode, User user) {
        FacilityPost p = postRepository.findByIdAndInstCodeAndKindCode(id, instCode, kindCode)
                .orElseThrow(() -> new RuntimeException("리뷰 없음"));

        if (!p.getWriter().getId().equals(user.getId()))
            throw new AccessDeniedException("권한 없음");

        postRepository.delete(p);
    }
}

