package me.hys.carematebackend.dto.ai;

import lombok.Data;

import java.util.Map;

@Data
public class AiRecommendRequest {
    private String message;         // 사용자가 쓴 자연어 요구사항
    private Map<String, Object> filter; // 현재 필터 payload(센터/반경/등급/프로그램 등)
}
