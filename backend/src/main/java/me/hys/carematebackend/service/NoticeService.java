package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.community.NoticeDtos;
import me.hys.carematebackend.mapper.CommunityMapper;
import me.hys.carematebackend.model.Notice;
import me.hys.carematebackend.repository.CareMateRepository;
import me.hys.carematebackend.repository.NoticeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository repo;
    private final CareMateRepository careRepo;

    public NoticeDtos.Res create(Long careMateId, Long authorUserId, NoticeDtos.CreateReq req){
        ensureCareMateExists(careMateId);
        Notice n = new Notice();
        n.setCareMateId(careMateId);
        n.setAuthorUserId(authorUserId);
        n.setTitle(req.title());
        n.setBody(req.body());
        n.setPinned(Boolean.TRUE.equals(req.pinned()));
        return CommunityMapper.toRes(repo.save(n));
    }

    public Page<NoticeDtos.Res> list(Long careMateId, Pageable pageable){
        // 기본 정렬: pinned DESC, createdAt DESC
        Sort sort = pageable.getSort().isUnsorted()
                ? Sort.by(Sort.Order.desc("pinned"), Sort.Order.desc("createdAt"))
                : pageable.getSort();
        Page<Notice> page = repo.findByCareMateId(careMateId, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
        return page.map(CommunityMapper::toRes);
    }

    private void ensureCareMateExists(Long careMateId){
        if (!careRepo.existsById(careMateId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "CareMate not found");
    }
}
