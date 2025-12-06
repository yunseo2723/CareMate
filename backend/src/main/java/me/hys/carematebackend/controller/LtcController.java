package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.FacilityDetailRes;
import me.hys.carematebackend.ltc.FacilityLiteRes;
import me.hys.carematebackend.model.LtcFacility;
import me.hys.carematebackend.repository.LtcFacilityRepository;
import me.hys.carematebackend.service.LtcDetailDbService;
import me.hys.carematebackend.service.LtcSimilarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ltc")
@RequiredArgsConstructor
public class LtcController {

    private final LtcSimilarService service;
    private final LtcFacilityRepository repo;
    private final LtcDetailDbService detailDbService;

    // 전국 Lite 리스트
    @GetMapping("/list/lite")
    public List<FacilityLiteRes> listLite() {
        List<LtcFacility> all;
        all = repo.findAll();
        return all.stream()
                .map(FacilityLiteRes::from)
                .toList();
    }

    @GetMapping("/detail")
    public FacilityDetailRes detail(
            @RequestParam String instCode,
            @RequestParam String kindCode
    ) {
        return detailDbService.getDetail(instCode, kindCode);
    }

    @GetMapping("/similar/{instCode}")
    public List<Map<String, Object>> similar(
            @PathVariable String instCode
    ) {
        return service.similar(instCode);
    }
}