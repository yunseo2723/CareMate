package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.Notice;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Page<Notice> findByCareMateId(Long careMateId, Pageable pageable);
}
