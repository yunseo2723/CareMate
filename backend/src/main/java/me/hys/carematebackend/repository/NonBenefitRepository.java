package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.LtcFacility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NonBenefitRepository extends JpaRepository<LtcFacility, Long> {

    List<LtcFacility> findByInstCodeAndKindCode(String instCode, String kindCode);
}
