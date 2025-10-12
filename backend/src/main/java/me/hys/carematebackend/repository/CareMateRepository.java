package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.CareMate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareMateRepository extends JpaRepository<CareMate, Long> {
    // 기본 CRUD(findById, findAll, save...)를 자동으로 제공함.
}
