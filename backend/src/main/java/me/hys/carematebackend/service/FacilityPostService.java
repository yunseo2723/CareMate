package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.community.CommentDto;
import me.hys.carematebackend.dto.community.FacilityPostListDto;
import me.hys.carematebackend.dto.community.PostDetailDto;
import me.hys.carematebackend.model.User;
import me.hys.carematebackend.model.community.FacilityBoardType;
import me.hys.carematebackend.model.community.FacilityComment;
import me.hys.carematebackend.model.community.FacilityPost;
import me.hys.carematebackend.repository.FacilityCommentRepository;
import me.hys.carematebackend.repository.FacilityPostRepository;
import me.hys.carematebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityPostService {

    private final FacilityPostRepository postRepo;
    private final FacilityCommentRepository commentRepo;
    private final UserRepository userRepo;

    /** 게시글 작성 */
    public FacilityPost createPost(Long userId, FacilityPost req) {
        User writer = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        req.setWriter(writer);
        req.setCreatedAt(LocalDateTime.now());
        req.setUpdatedAt(LocalDateTime.now());

        return postRepo.save(req);
    }

    /** 게시글 목록 조회 */
    public List<FacilityPostListDto> getPosts(String instCode, FacilityBoardType type) {

        List<FacilityPost> posts =
                postRepo.findByInstCodeAndBoardTypeOrderByCreatedAtDesc(instCode, type);

        return posts.stream()
                .map(p -> new FacilityPostListDto(
                        p.getId(),
                        p.getTitle(),
                        p.getWriter() != null ? p.getWriter().getName() : "알 수 없음",
                        p.getCreatedAt() != null ? p.getCreatedAt().toString() : "",
                        commentRepo.countByPostId(p.getId())
                ))
                .toList();
    }

    public PostDetailDto getPost(String instCode, Long postId) {
        FacilityPost post = postRepo.findByIdAndInstCode(postId, instCode)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 댓글 전체 로드
        List<FacilityComment> all = commentRepo.findByPostIdOrderByCreatedAtAsc(postId);

        // 부모 댓글만 걸러내기
        List<FacilityComment> roots = all.stream()
                .filter(c -> c.getParent() == null)
                .toList();

        return new PostDetailDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getWriter().getName(),
                post.getCreatedAt().toString(),
                post.isAllowComment(),
                convertToDtoWithReplies(roots, all)
        );
    }

    public List<CommentDto> convertToDtoWithReplies(
            List<FacilityComment> roots,
            List<FacilityComment> all
    ) {
        return roots.stream()
                .map(c -> new CommentDto(
                        c.getId(),
                        c.getWriter().getName(),
                        c.getContent(),
                        c.getCreatedAt().toString(),
                        getReplies(c.getId(), all)  // 🔥 대댓글 포함
                ))
                .toList();
    }

    private List<CommentDto> getReplies(Long parentId, List<FacilityComment> all) {
        return all.stream()
                .filter(c -> c.getParent() != null && c.getParent().getId().equals(parentId))
                .map(c -> new CommentDto(
                        c.getId(),
                        c.getWriter().getName(),
                        c.getContent(),
                        c.getCreatedAt().toString(),
                        getReplies(c.getId(), all)  // 재귀
                ))
                .toList();
    }


    /** 댓글 작성 */
    public FacilityComment writeComment(Long userId, String instCode, Long postId, String content, Long parentId
    ) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("댓글 내용을 입력해주세요.");
        }

        FacilityPost post = postRepo.findByIdAndInstCode(postId, instCode)
                .orElseThrow(() -> new RuntimeException("해당 요양원의 게시글이 아닙니다."));

        User writer = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FacilityComment parent = null;
        if (parentId != null) {
            parent = commentRepo.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("부모 댓글 없음"));
        }

        FacilityComment c = FacilityComment.builder()
                .post(post)
                .writer(writer)
                .content(content)
                .parent(parent)
                .createdAt(LocalDateTime.now())
                .build();

        return commentRepo.save(c);
    }

}

