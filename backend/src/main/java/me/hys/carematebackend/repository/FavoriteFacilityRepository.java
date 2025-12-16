package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.FavoriteFacility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteFacilityRepository
        extends JpaRepository<FavoriteFacility, Long> {

    Optional<FavoriteFacility> findByUserIdAndInstCodeAndKindCode(
            Long userId, String instCode, String kindCode
    );

    List<FavoriteFacility> findByUserId(Long userId);

    boolean existsByUserIdAndInstCodeAndKindCode(
            Long userId, String instCode, String kindCode
    );
}

