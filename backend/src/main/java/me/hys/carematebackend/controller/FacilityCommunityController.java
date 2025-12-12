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

    /** 게시글 작성 */
    @PostMapping("/{instCode}/post")
    public ResponseEntity<?> createPost(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @RequestBody FacilityPost req
    ) {
        req.setInstCode(instCode);

        Long postId = postService.createPost(
                cud.getUser().getId(),
                req
        );

        return ResponseEntity.ok(Map.of(
                "id", postId,
                "message", "created"
        ));
    }

    /** 게시글 목록 조회 */
    @GetMapping("/{instCode}/post")
    public ResponseEntity<?> list(
            @PathVariable String instCode,
            @RequestParam String type
    ) {
        return ResponseEntity.ok(
                postService.getPosts(instCode, FacilityBoardType.valueOf(type))
        );
    }

    /** 게시글 상세 조회 (+ 댓글 전체 포함) */
    @GetMapping("/{instCode}/post/{postId}")
    public ResponseEntity<?> getPost(
            @PathVariable String instCode,
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(postService.getPost(instCode, postId));
    }

    /** 댓글 작성 */
    @PostMapping("/{instCode}/post/{postId}/comment")
    public ResponseEntity<?> writeComment(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable Long postId,
            @RequestBody Map<String, Object> req
    ) {
        String content = (String) req.get("content");
        Long parentId = req.get("parentId") != null
                ? Long.valueOf(req.get("parentId").toString())
                : null;

        postService.writeComment(
                cud.getUser().getId(),
                instCode,
                postId,
                content,
                parentId
        );

        return ResponseEntity.ok(Map.of("message", "created"));
    }

    /** 댓글 수정 */
    @PatchMapping("/{instCode}/post/{postId}/comment/{commentId}")
    public ResponseEntity<?> updateComment(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> req
    ) {
        postService.updateComment(
                cud.getUser().getId(),
                instCode,
                postId,
                commentId,
                req.get("content")
        );

        return ResponseEntity.ok(Map.of("message", "updated"));
    }

    /** 댓글 삭제 */
    @DeleteMapping("/{instCode}/post/{postId}/comment/{commentId}")
    public ResponseEntity<?> deleteComment(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable Long postId,
            @PathVariable Long commentId
    ) {
        postService.deleteComment(
                cud.getUser().getId(),
                instCode,
                postId,
                commentId
        );

        return ResponseEntity.ok(Map.of("message", "deleted"));
    }
}
