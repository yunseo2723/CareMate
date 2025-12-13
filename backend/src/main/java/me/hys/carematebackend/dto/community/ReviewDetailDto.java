package me.hys.carematebackend.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewDetailDto {
    private Long id;
    private String title;
    private String content;
    private int rating;
    private String writerName;
    private LocalDateTime createdAt;
    private int viewCount;
}
