package me.hys.carematebackend.dto.community;

import lombok.Data;

@Data
public class ReviewDto {
    private String title;
    private String content;
    private Integer rating; // 1~5
}
