package me.hys.carematebackend.dto.community;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PostDetailDto {

    private Long id;
    private String title;
    private String content;
    private String writerName;
    private String createdAt;
    private boolean allowComment;

    private List<CommentDto> comments; // 댓글 + 대댓글
}
