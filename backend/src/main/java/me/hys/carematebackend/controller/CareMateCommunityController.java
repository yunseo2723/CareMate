package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.community.NoticeDtos;
import me.hys.carematebackend.dto.community.TalkDtos;
import me.hys.carematebackend.dto.user.CustomUserDetails;
import me.hys.carematebackend.service.NoticeService;
import me.hys.carematebackend.service.TalkService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/caremates/{careMateId}")
public class CareMateCommunityController {

    private final NoticeService noticeService;
    private final TalkService talkService;

    /* ---------- 공지 ---------- */

    // 공지 등록: 관리자만
    @PostMapping("/notices")
    @PreAuthorize("@ownership.isCareMateAdmin(authentication, #careMateId)")
    public NoticeDtos.Res createNotice(@PathVariable Long careMateId,
                                       @RequestBody NoticeDtos.CreateReq req,
                                       Authentication auth) {
        Long userId = ((CustomUserDetails)auth.getPrincipal()).getUser().getId();
        return noticeService.create(careMateId, userId, req);
    }

    // 공지 조회: 모두
    @GetMapping("/notices")
    public Page<NoticeDtos.Res> listNotices(@PathVariable Long careMateId, Pageable pageable){
        return noticeService.list(careMateId, pageable);
    }

    /* ---------- 소통 ---------- */

    // 소통 등록: 로그인 사용자 누구나
    @PostMapping("/talks")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public TalkDtos.Res createTalk(@PathVariable Long careMateId,
                                   @RequestBody TalkDtos.CreateReq req,
                                   Authentication auth){
        Long userId = ((CustomUserDetails)auth.getPrincipal()).getUser().getId();
        return talkService.create(careMateId, userId, req);
    }

    // 소통 조회: 모두
    @GetMapping("/talks")
    public Page<TalkDtos.Res> listTalks(@PathVariable Long careMateId, Pageable pageable){
        return talkService.list(careMateId, pageable);
    }
}
