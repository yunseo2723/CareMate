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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityPostService {

    private final FacilityPostRepository postRepo;
    private final FacilityCommentRepository commentRepo;
    private final UserRepository userRepo;

    /** 게시글 작성 */
    public Long createPost(Long userId, FacilityPost req) {
        User writer = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        req.setWriter(writer);
        req.setCreatedAt(LocalDateTime.now());
        req.setUpdatedAt(LocalDateTime.now());

        FacilityPost saved = postRepo.save(req);

        return saved.getId(); // 🔥 Long 반환
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

    public List<CommentDto> convertToDtoWithReplies(List<FacilityComment> roots, List<FacilityComment> all) {
        return roots.stream()
                .map(c -> new CommentDto(
                        c.getId(),
                        c.isDeleted() ? "(알 수 없음)" : c.getWriter().getName(),
                        c.isDeleted() ? "삭제된 댓글입니다." : c.getContent(),
                        c.getCreatedAt().toString(),
                        c.isDeleted(),
                        getReplies(c.getId(), all)
                ))
                .toList();
    }

    private List<CommentDto> getReplies(Long parentId, List<FacilityComment> all) {
        return all.stream()
                .filter(c -> c.getParent() != null && c.getParent().getId().equals(parentId))
                .map(c -> new CommentDto(
                        c.getId(),
                        c.isDeleted() ? "(알 수 없음)" : c.getWriter().getName(),
                        c.isDeleted() ? "삭제된 댓글입니다." : c.getContent(),
                        c.getCreatedAt().toString(),
                        c.isDeleted(),
                        getReplies(c.getId(), all)
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

    @Transactional
    public FacilityComment updateComment(Long userId, String instCode, Long postId, Long commentId, String content) {

        if (content == null || content.trim().isEmpty())
            throw new RuntimeException("내용을 입력해주세요.");

        FacilityPost post = postRepo.findByIdAndInstCode(postId, instCode)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        FacilityComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

        if (!comment.getWriter().getId().equals(userId))
            throw new RuntimeException("본인의 댓글만 수정할 수 있습니다.");

        comment.setContent(content);
        comment.setCreatedAt(comment.getCreatedAt()); // 유지
        return commentRepo.save(comment);
    }

    @Transactional
    public void deleteComment(Long userId, String instCode, Long postId, Long commentId) {
        FacilityComment c = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        if (!c.getWriter().getId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        // ⭐ 대댓글 여부 확인
        boolean hasReplies =
                !c.getReplies().isEmpty();

        if (hasReplies) {
            // ⭐ Soft delete → "삭제된 댓글입니다"
            c.setDeleted(true);
            c.setContent("삭제된 댓글입니다.");
            commentRepo.save(c);
        } else {
            // ⭐ Hard delete → 그냥 삭제
            commentRepo.delete(c);
        }
    }


}

