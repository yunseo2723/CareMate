package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class FacilityAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 어떤 요양원(기관)의 관리자? */
    private String instCode;

    /** 관리자 유저 */
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private LocalDateTime createdAt;
}
