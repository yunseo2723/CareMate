package me.hys.carematebackend.repository;

import me.hys.carematebackend.model.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Page<Notice> findByCareMateId(Long careMateId, Pageable pageable);
}
