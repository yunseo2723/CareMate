package me.hys.carematebackend.controller;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.service.LtcSearchClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LtcListController {

    private final LtcSearchClient client;

    /** 프록시: XML 그대로 반환 (프론트가 직접 파싱/지오코딩할 때) */
    @GetMapping(value = "/ltc/facilities/raw", produces = MediaType.APPLICATION_XML_VALUE)
    public String listRaw(
            @RequestParam(required = false) String siDoCd,
            @RequestParam(required = false) String siGunGuCd,
            @RequestParam(required = false) String adminPttnCd,
            @RequestParam(required = false) String startRgtDt,
            @RequestParam(required = false) String endRgtDt,
            @RequestParam(required = false) String startStpRptDt,
            @RequestParam(required = false) String endStpRptDt,
            @RequestParam(required = false) String adminNm
    ) {
        return client.list(
                siDoCd, siGunGuCd, adminPttnCd,
                startRgtDt, endRgtDt, startStpRptDt, endStpRptDt,
                adminNm
        ).block();
    }
}
