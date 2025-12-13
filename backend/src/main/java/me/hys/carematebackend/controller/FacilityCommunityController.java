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
    @PostMapping("/{instCode}/{kindCode}/post")
    public ResponseEntity<?> createPost(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @RequestBody FacilityPost req
    ) {
        req.setInstCode(instCode);
        req.setKindCode(kindCode);

        Long postId = postService.createPost(
                cud.getUser().getId(),
                req
        );

        return ResponseEntity.ok(Map.of(
                "id", postId,
                "message", "created"
        ));
    }

    /** 게시글 수정 */
    @PatchMapping("/{instCode}/{kindCode}/post/{postId}")
    public ResponseEntity<?> updatePost(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @PathVariable Long postId,
            @RequestBody Map<String, String> req
            )  {
        postService.updatePost(
                cud.getUser().getId(),
                instCode,
                kindCode,
                postId,
                req.get("title"),
                req.get("content")
        );
        return ResponseEntity.ok(Map.of("message", "updated"));
    }

    /** 댓글 삭제 */
    @DeleteMapping("/{instCode}/{kindCode}/post/{postId}")
    public ResponseEntity<?> deletePost(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @PathVariable Long postId
    ) {
        postService.deletePost(
                cud.getUser().getId(),
                instCode,
                kindCode,
                postId
        );

        return ResponseEntity.ok(Map.of("message", "deleted"));
    }

    /** 게시글 목록 조회 */
    @GetMapping("/{instCode}/{kindCode}/post")
    public ResponseEntity<?> list(
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @RequestParam String type
    ) {
        return ResponseEntity.ok(
                postService.getPosts(instCode, kindCode, FacilityBoardType.valueOf(type))
        );
    }

    /** 게시글 상세 조회 (+ 댓글 전체 포함) */
    @GetMapping("/{instCode}/{kindCode}/post/{postId}")
    public ResponseEntity<?> getPost(
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @PathVariable Long postId
    ) {
        return ResponseEntity.ok(postService.getPost(instCode, kindCode, postId));
    }

    /** 댓글 작성 */
    @PostMapping("/{instCode}/{kindCode}/post/{postId}/comment")
    public ResponseEntity<?> writeComment(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable String kindCode,
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
                kindCode,
                postId,
                content,
                parentId
        );

        return ResponseEntity.ok(Map.of("message", "created"));
    }

    /** 댓글 수정 */
    @PatchMapping("/{instCode}/{kindCode}/post/{postId}/comment/{commentId}")
    public ResponseEntity<?> updateComment(
            @AuthenticationPrincipal CustomUserDetails cud,
            @PathVariable String instCode,
            @PathVariable String kindCode,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> req
    ) {
        postService.updateComment(
                cud.getUser().getId(),
                instCode,
                kindCode,
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
