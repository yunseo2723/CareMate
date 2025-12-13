package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.community.ReviewDetailDto;
import me.hys.carematebackend.dto.community.ReviewDto;
import me.hys.carematebackend.dto.community.ReviewListDto;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/facility/{instCode}/{kindCode}/review")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @RequestBody ReviewDto req,
            @AuthenticationPrincipal CustomUserDetails cud
    ) {
        reviewService.createReview(instCode, kindCode, req, cud.getUser());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<ReviewListDto> getReviews(
            @PathVariable String instCode,
            @PathVariable String kindCode) {
        return reviewService.getReviews(instCode, kindCode);
    }

    /** 리뷰 상세 */
    @GetMapping("/{id}")
    public ReviewDetailDto detailReview(
            @PathVariable Long id,
            @PathVariable String instCode,
            @PathVariable String kindCode
    ) {
        return reviewService.detailReview(id, instCode, kindCode);
    }

    /** 리뷰 수정 */
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @RequestBody ReviewDto req,
            @AuthenticationPrincipal CustomUserDetails cud
    ) {
        reviewService.updateReview(id, instCode, kindCode, req, cud.getUser());
        return ResponseEntity.ok().build();
    }

    /** 리뷰 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long id,
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @AuthenticationPrincipal CustomUserDetails cud
    ) {
        reviewService.deleteReview(id, instCode, kindCode, cud.getUser());
        return ResponseEntity.ok().build();
    }
}

