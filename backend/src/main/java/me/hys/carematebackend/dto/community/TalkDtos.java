package me.hys.carematebackend.dto.community;

import java.time.LocalDateTime;

public class TalkDtos {
    public record CreateReq(String body, Long parentId) {}
    public record Res(Long id, Long careMateId, Long authorUserId,
                      String body, Long parentId, LocalDateTime createdAt) {}
}
