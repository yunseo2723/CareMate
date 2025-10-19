package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.LtcFacility;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface LtcFacilityRepository extends JpaRepository<LtcFacility, String> {
    @Query("""
    SELECT f FROM LtcFacility f
    WHERE (:sido IS NULL OR f.sido = :sido)
      AND (:sgg IS NULL OR f.sgg = :sgg)
      AND (:type IS NULL OR f.type = :type)
      AND (:q IS NULL OR
           LOWER(f.name) LIKE LOWER(CONCAT('%',:q,'%')) OR
           LOWER(f.address) LIKE LOWER(CONCAT('%',:q,'%')))
  """)
    Page<LtcFacility> search(String sido, String sgg, String type, String q, Pageable pageable);
}