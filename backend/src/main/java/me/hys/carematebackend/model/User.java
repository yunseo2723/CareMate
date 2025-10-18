package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Builder(builderMethodName = "signupBuilder")
    public User(String username, String password, String nickname, String name) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.name = name;
    }
}