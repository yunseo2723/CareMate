package me.hys.carematebackend.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MyReviewDto {
    private Long id;
    private String instCode;
    private String kindCode;
    private String facilityName;
    private String title;
    private int rating;
    private LocalDateTime createdAt;
    private int viewCount;
}

