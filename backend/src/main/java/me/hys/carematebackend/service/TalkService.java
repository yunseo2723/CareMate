package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.community.TalkDtos;
import me.hys.carematebackend.mapper.CommunityMapper;
import me.hys.carematebackend.model.Talk;
import me.hys.carematebackend.repository.CareMateRepository;
import me.hys.carematebackend.repository.TalkRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TalkService {
    private final TalkRepository repo;
    private final CareMateRepository careRepo;

    public TalkDtos.Res create(Long careMateId, Long authorUserId, TalkDtos.CreateReq req){
        ensureCareMateExists(careMateId);
        Talk t = new Talk();
        t.setCareMateId(careMateId);
        t.setAuthorUserId(authorUserId);
        t.setBody(req.body());
        t.setParentId(req.parentId()); // null이면 루트
        return CommunityMapper.toRes(repo.save(t));
    }

    public Page<TalkDtos.Res> list(Long careMateId, Pageable pageable){
        // 기본 정렬: createdAt ASC (대화 흐름)
        Sort sort = pageable.getSort().isUnsorted()
                ? Sort.by(Sort.Order.asc("createdAt"))
                : pageable.getSort();
        Page<Talk> page = repo.findByCareMateId(careMateId, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
        return page.map(CommunityMapper::toRes);
    }

    private void ensureCareMateExists(Long careMateId){
        if (!careRepo.existsById(careMateId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "CareMate not found");
    }
}
