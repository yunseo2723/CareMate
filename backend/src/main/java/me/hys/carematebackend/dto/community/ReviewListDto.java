package me.hys.carematebackend.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReviewListDto {
    private Long id;
    private String title;
    private int rating;
    private String writerName;
    private LocalDateTime createdAt;
    private int viewCount;
}

