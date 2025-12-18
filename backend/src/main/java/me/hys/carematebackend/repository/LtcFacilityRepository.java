package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.LtcFacility;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LtcFacilityRepository extends JpaRepository<LtcFacility, String> {
    Optional<LtcFacility> findByInstCode(String instCode);

    Optional<LtcFacility> findByInstCodeAndKindCode(String instCode, String kindCode);

    List<LtcFacility> findTop10ByNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<LtcFacility> findTop200ByOrderByInstCodeAsc();

    @Query("""
select f
from LtcFacility f
where f.lat between :minLat and :maxLat
  and f.lng between :minLng and :maxLng
""")
    List<LtcFacility> findInBounds(
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLng") double minLng,
            @Param("maxLng") double maxLng,
            Pageable pageable
    );


}
