package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedFilter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String name; // 사용자가 붙이는 필터 이름

    @Column(columnDefinition = "TEXT")
    private String filterJson; // JSON 형태 그대로 저장

    private LocalDateTime createdAt;
}
