package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ltc.FacilityDetailRes;
import me.hys.carematebackend.dto.ltc.FacilityLiteRes;
import me.hys.carematebackend.dto.ltc.LtcFacilitySearchDto;
import me.hys.carematebackend.service.LtcDetailDbService;
import me.hys.carematebackend.service.LtcSearchService;
import me.hys.carematebackend.service.LtcSimilarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ltc")
@RequiredArgsConstructor
public class LtcController {

    private final LtcSimilarService service;
    private final LtcDetailDbService detailDbService;
    private final LtcSearchService searchService;

    // 전국 요양원 lite 리스트
    @GetMapping("/map/lite")
    public List<FacilityLiteRes> mapLite(
            @RequestParam double centerLat,
            @RequestParam double centerLng,
            @RequestParam double radiusKm,
            @RequestParam(defaultValue = "500") int limit
    ) {
        limit = Math.min(limit, 1500); // 안전장치
        return searchService.findLiteInRadius(
                centerLat, centerLng, radiusKm, limit
        );
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

    @GetMapping("/search/{name}")
    public List<LtcFacilitySearchDto> search(@PathVariable String name) {
        return searchService.search(name);
    }
}