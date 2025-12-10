package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.model.community.FacilityBoardType;
import me.hys.carematebackend.model.community.FacilityPost;
import me.hys.carematebackend.service.FacilityPostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/facility")
public class FacilityCommunityController {

    private final FacilityPostService postService;

    /**
     * 게시글 작성
     */
    @PostMapping("/{instCode}/post")
    public ResponseEntity<?> createPost(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @RequestBody FacilityPost req
    ) {
        req.setInstCode(instCode);

        FacilityPost saved = postService.createPost(
                cud.getUser().getId(),
                req
        );

        // 엔티티 그대로 보내면 안 됨
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "message", "created"
        ));
    }

    /**
     * 게시글 목록 조회
     */
    @GetMapping("/{instCode}/post")
    public ResponseEntity<?> list(
            @PathVariable String instCode,
            @RequestParam String type
    ) {
        FacilityBoardType boardType = FacilityBoardType.valueOf(type);

        return ResponseEntity.ok(
                postService.getPosts(instCode, boardType)
        );
    }

    @GetMapping("/{instCode}/post/{postId}")
    public ResponseEntity<?> getPost(
            @PathVariable String instCode,
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(postService.getPost(instCode, postId));
    }


    /**
     * 댓글 작성
     */
    @PostMapping("/{instCode}/post/{postId}/comment")
    public ResponseEntity<?> writeComment(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable Long postId,
            @RequestBody Map<String, Object> req
    ) {
        String content = (String) req.get("content");
        Object pObj = req.get("parentId");

        Long parentId = null;
        if (pObj != null) {
            parentId = Long.valueOf(String.valueOf(pObj));
        }

        return ResponseEntity.ok(
                postService.writeComment(
                        cud.getUser().getId(),
                        instCode,
                        postId,
                        content,
                        parentId
                )
        );
    }
}
