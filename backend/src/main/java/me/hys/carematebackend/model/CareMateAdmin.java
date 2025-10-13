package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "caremate_admins",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","caremate_id"}))
public class CareMateAdmin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long careMateId;
    private LocalDateTime createdAt = LocalDateTime.now();
}
