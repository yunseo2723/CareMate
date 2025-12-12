package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.SavedFilter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedFilterRepository extends JpaRepository<SavedFilter, Long> {
    List<SavedFilter> findByUserId(Long userId);
}
