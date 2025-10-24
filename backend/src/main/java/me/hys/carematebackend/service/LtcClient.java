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
public class LtcClient {

    // 필요하면 @Bean으로 주입받아도 OK
    private final WebClient webClient = WebClient.builder().build();

    /** 예: https://apis.data.go.kr/B550928/getLtcInsttDetailInfoService02 */
    @Value("${ltc.api.base}")
    String baseUrl;

    /** ★ Decoding 키 그대로 (+= 포함) */
    @Value("${ltc.api.serviceKey}")
    String serviceKey;

    /** 공통: URL 조립 */
    private URI buildUri(String path, Map<String, String> q) {
        UriComponentsBuilder b = UriComponentsBuilder.fromHttpUrl(baseUrl + path);
        if (q != null) q.forEach(b::queryParam);      // Map<String,String> 그대로
        return b.build(true).toUri();                // 🔸 자동 인코딩(Decoding 키 사용 시 권장)
    }

    /** 공통 호출: XML String으로 */
    private Mono<String> call(String path, Map<String, String> params) {
        Map<String, String> q = new LinkedHashMap<>();
        q.put("serviceKey", serviceKey);              // 공통 파라미터
        if (params != null) q.putAll(params);         // 개별 파라미터 병합

        URI uri = buildUri(path, q);

        return webClient.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .bodyToMono(String.class);
    }

    /** 1) 일반현황 */
    public Mono<String> general(String instCode, String kindCode) {
        Map<String, String> p = Map.of(
                "longTermAdminSym", instCode,   // 기관코드
                "adminPttnCd",      kindCode    // 기관유형코드
        );
        return call("/getGeneralSttusDetailInfoItem02", p);
    }

    /** 2) 종사자현황 */
    public Mono<String> staff(String instCode, String kindCode) {
        Map<String, String> p = Map.of(
                "longTermAdminSym", instCode,
                "adminPttnCd",      kindCode
        );
        return call("/getStaffSttusDetailInfoItem02", p);
    }

    /** 3) 시설개요 */
    public Mono<String> instt(String instCode, String kindCode) {
        Map<String, String> p = Map.of(
                "longTermAdminSym", instCode,
                "adminPttnCd",      kindCode
        );
        return call("/getInsttSttusDetailInfoItem02", p);
    }

    /** 4) 수용가능인원 */
    public Mono<String> aceptncNmpr(String instCode, String kindCode) {
        Map<String, String> p = Map.of(
                "longTermAdminSym", instCode,
                "adminPttnCd",      kindCode
        );
        return call("/getAceptncNmprDetailInfoItem02", p);
    }

    /** 5) 비급여 목록(페이징) */
    public Mono<String> nonBenefitList(String instCode, int pageNo, int size) {
        Map<String, String> p = new LinkedHashMap<>();
        p.put("longTermAdminSym", instCode);
        p.put("pageNo",          String.valueOf(pageNo));
        p.put("numOfRows",       String.valueOf(size));
        // 필요 시 기관유형코드가 문서에 요구되면 p.put("adminPttnCd", kindCode) 추가
        return call("/getNonBenefitSttusDetailInfoList02", p);
    }
}
