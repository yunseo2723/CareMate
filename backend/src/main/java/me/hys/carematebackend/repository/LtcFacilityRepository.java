package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.LtcFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LtcFacilityRepository extends JpaRepository<LtcFacility, String> {
    Optional<LtcFacility> findByInstCode(String instCode);

    Optional<LtcFacility> findByInstCodeAndKindCode(String instCode, String kindCode);

    List<LtcFacility> findTop200ByOrderByInstCodeAsc();
}
