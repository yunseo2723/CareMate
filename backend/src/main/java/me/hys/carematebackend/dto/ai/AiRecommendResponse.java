package me.hys.carematebackend.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AiRecommendResponse {
    private String normalizedNeed; // GPT가 정리한 요구사항
    private List<Item> items;

    @Data
    @AllArgsConstructor
    public static class Item {
        private String instCode;
        private String kindCode;
        private String name;
        private String address;
        private String reason;
    }
}
