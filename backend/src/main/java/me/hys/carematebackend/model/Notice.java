package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "caremate_notices")
@Getter @Setter
public class Notice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 소속 요양원
    @Column(name = "care_mate_id", nullable = false)
    private Long careMateId;

    // 작성자
    @Column(name = "author_user_id", nullable = false)
    private Long authorUserId;

    @Column(nullable = false)
    private String title;

    @Lob @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private boolean pinned = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist void onCreate(){ createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  void onUpdate(){ updatedAt = LocalDateTime.now(); }
}
