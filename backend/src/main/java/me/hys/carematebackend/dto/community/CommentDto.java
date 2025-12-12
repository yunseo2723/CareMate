package me.hys.carematebackend.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data @AllArgsConstructor
public class CommentDto {
    private Long id;
    private String writerName;
    private String content;
    private String createdAt;
    private boolean deleted;

    private List<CommentDto> replies;
}
