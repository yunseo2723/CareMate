package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.CareMate;
import org.springframework.data.jpa.repository.*;

public interface CareMateRepository extends JpaRepository<CareMate, Long>, JpaSpecificationExecutor<CareMate> {}
