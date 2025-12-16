package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// model/FavoriteFacility.java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "inst_code", "kind_code"}
        )
)
public class FavoriteFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String instCode;
    private String kindCode;
    private String name;
    private String address;

    private LocalDateTime createdAt;
}

