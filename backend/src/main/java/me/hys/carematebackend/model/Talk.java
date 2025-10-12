package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "caremate_talks")
@Getter @Setter
public class Talk {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "care_mate_id", nullable = false)
    private Long careMateId;

    @Column(name = "author_user_id", nullable = false)
    private Long authorUserId;

    @Lob @Column(nullable = false)
    private String body;

    // 대댓글 부모 ID (루트면 null)
    @Column(name = "parent_id")
    private Long parentId;

    private LocalDateTime createdAt;

    @PrePersist void onCreate(){ createdAt = LocalDateTime.now(); }
}
