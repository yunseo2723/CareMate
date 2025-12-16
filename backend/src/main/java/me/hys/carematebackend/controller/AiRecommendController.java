package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ai.AiRecommendRequest;
import me.hys.carematebackend.dto.ai.AiRecommendResponse;
import me.hys.carematebackend.service.ai.AiRecommendService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ai")
public class AiRecommendController {

    private final AiRecommendService aiRecommendService;

    @PostMapping("/recommend")
    public ResponseEntity<AiRecommendResponse> recommend(
            @RequestBody AiRecommendRequest req
    ) {
        return ResponseEntity.ok(aiRecommendService.recommend(req));
    }
}
