package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LtcSearchClient {
    private final WebClient http = WebClient.builder().build();

    @Value("${ltc.api.base1}")
    private String base1;

    @Value("${ltc.api.serviceKey}")
    private String serviceKey;

    private static boolean nz(String s){ return s != null && !s.isBlank(); }

    /** 파라미터(필수/선택)를 먼저 붙이고, serviceKey는 반드시 마지막에 붙인다. */
    private URI build(String path, Map<String,String> q) {
        UriComponentsBuilder b = UriComponentsBuilder.fromHttpUrl(base1 + path);
        if (q != null) q.forEach(b::queryParam);
        b.queryParam("serviceKey", serviceKey);
        // 이미 인코딩된 값(특히 serviceKey)을 보존하려면 true
        return b.build(true).toUri();
    }

    public Mono<String> list(
            String siDoCd,
            String siGunGuCd,
            String adminPttnCd,
            String startRgtDt,   // 지정일 시작(YYYYMMDD)  (옵션)
            String endRgtDt,     // 지정일 끝
            String startStpRptDt,// 신고일 시작
            String endStpRptDt,  // 신고일 끝
            String adminNm      // 기관명 키워드
    ) {
        Map<String,String> q = new LinkedHashMap<>();
        if (nz(siDoCd))       q.put("siDoCd", siDoCd);
        if (nz(siGunGuCd))    q.put("siGunGuCd", siGunGuCd);
        if (nz(adminPttnCd))  q.put("adminPttnCd", adminPttnCd);
        if (nz(startRgtDt))   q.put("startRgtDt", startRgtDt);
        if (nz(endRgtDt))     q.put("endRgtDt", endRgtDt);
        if (nz(startStpRptDt))q.put("startStpRptDt", startStpRptDt);
        if (nz(endStpRptDt))  q.put("endStpRptDt", endStpRptDt);
        if (nz(adminNm))      q.put("adminNm", adminNm);

        URI uri = build("/getLtcInsttSeachList01", q);
        System.out.println("[LtcSearchClient] CALL " + uri);

        return http.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .bodyToMono(String.class);
    }
}
