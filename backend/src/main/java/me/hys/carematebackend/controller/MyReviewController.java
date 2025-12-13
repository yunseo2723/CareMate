package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.service.MyReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/myreview")
public class MyReviewController {

    private final MyReviewService myPageService;

    @GetMapping("/reviews")
    public ResponseEntity<?> myReviews(
            @AuthenticationPrincipal CustomUserDetails cud
    ) {
        return ResponseEntity.ok(
                myPageService.getMyReviews(cud.getUser().getId())
        );
    }
}

