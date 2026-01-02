package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.recommend.RecommendResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RestTemplate restTemplate;

    // ✅ 리뷰 기반 TOP 추천
    @GetMapping("/top")
    public RecommendResponse recommendTop(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return restTemplate.getForObject(
                "http://localhost:8000/recommend/top?limit=" + limit,
                RecommendResponse.class
        );
    }
}
