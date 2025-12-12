package me.hys.carematebackend.model.community;

import jakarta.persistence.*;
import lombok.*;
import me.hys.carematebackend.model.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class FacilityComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private FacilityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    private User writer;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    private FacilityComment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<FacilityComment> replies = new ArrayList<>();

    private LocalDateTime createdAt;

    private boolean isDeleted = false;   // ⭐ Soft delete flag
}
