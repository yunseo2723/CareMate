package me.hys.carematebackend.model.community;

import jakarta.persistence.*;
import lombok.*;
import me.hys.carematebackend.model.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class FacilityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String instCode;
    private String kindCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "board_type", length = 20)
    private FacilityBoardType boardType;  // 공지사항 / 자유게시판

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private boolean allowComment; // 댓글 허용 여부

    @ManyToOne(fetch = FetchType.LAZY)
    private User writer; // 작성자

    // ⭐ 리뷰 전용
    private Integer rating; // 1~5 (REVIEW만 사용)

    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<FacilityComment> comments;
}
