package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.Talk;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TalkRepository extends JpaRepository<Talk, Long> {
    Page<Talk> findByCareMateId(Long careMateId, Pageable pageable);
}
