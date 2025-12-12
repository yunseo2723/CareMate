package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.LtcFacility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<LtcFacility, String> {
}
