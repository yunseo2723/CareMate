package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.LtcFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LtcFacilityRepository extends JpaRepository<LtcFacility, String> {

    Optional<LtcFacility> findByInstCodeAndKindCode(String instCode, String kindCode);

}
