package me.hys.carematebackend.dto.community;

import java.time.LocalDateTime;

public class NoticeDtos {
    public record CreateReq(String title, String body, Boolean pinned) {}
    public record Res(Long id, Long careMateId, Long authorUserId,
                      String title, String body, boolean pinned,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {}
}
