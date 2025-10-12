package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.Talk;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TalkRepository extends JpaRepository<Talk, Long> {
    Page<Talk> findByCareMateId(Long careMateId, Pageable pageable);
}
