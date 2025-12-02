package me.hys.carematebackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

// LtcClient.java
@Service
@RequiredArgsConstructor
public class LtcClient {
    private final WebClient webClient = WebClient.builder().build();

    @Value("${ltc.api.base2}")       String baseUrl2;     // 예: https://apis.data.go.kr/B550928/getLtcInsttDetailInfoService02
    @Value("${ltc.api.serviceKey}") String serviceKey;  // ★ 디코딩된 원문 키(= % 안붙은) 그대로

    private URI buildUri(String path, Map<String,String> params) {
        UriComponentsBuilder b = UriComponentsBuilder.fromHttpUrl(baseUrl2 + path);
        if (params != null) params.forEach(b::queryParam);
        return b.build(true).toUri(); // ★ 이미 인코딩된 값 보존
    }

    private Mono<String> call(String path, Map<String,String> params) {
        Map<String,String> q = new LinkedHashMap<>();

        if (params != null) q.putAll(params);

        q.put("serviceKey", serviceKey);           // ★ 무조건 포함
        URI uri = buildUri(path, q);
        System.out.println("[LtcClient] CALL " + uri);

        return webClient.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .onStatus(
                        HttpStatusCode::isError,
                        resp -> resp.bodyToMono(String.class).flatMap(body ->
                                Mono.error(new IllegalStateException(
                                        "API " + path + " -> " + resp.statusCode() + "\n" +
                                                "BODY: " + body.substring(0, Math.min(400, body.length()))
                                ))
                        )
                )
                .bodyToMono(String.class)
                .doOnNext(body -> {
                    String head = body.substring(0, Math.min(200, body.length())).replaceAll("[\\r\\n]+", " ");
                    System.out.println("[LtcClient] " + path + " OK head: " + head);
                });
    }

    // ★★★ 반드시 ‘02’ 접미사 포함한 정확한 경로 사용 ★★★
    public Mono<String> general(String instCode, String kindCode) {
        return call("/getGeneralSttusDetailInfoItem02", Map.of(

                "adminPttnCd", kindCode,
                "longTermAdminSym", instCode
        ));
    }

    public Mono<String> staff(String instCode, String kindCode) {
        return call("/getStaffSttusDetailInfoItem02", Map.of(
                "longTermAdminSym", instCode,
                "adminPttnCd", kindCode
        ));
    }

    public Mono<String> instt(String instCode, String kindCode) {
        return call("/getInsttSttusDetailInfoItem02", Map.of(
                "longTermAdminSym", instCode,
                "adminPttnCd", kindCode
        ));
    }

    public Mono<String> aceptnc(String instCode, String kindCode) {
        return call("/getAceptncNmprDetailInfoItem02", Map.of(
                "longTermAdminSym", instCode,
                "adminPttnCd", kindCode
        ));
    }

    public Mono<String> programList(String instCode, int pageNo, int numOfRows) {
        Map<String,String> p = new LinkedHashMap<>();
        p.put("longTermAdminSym", instCode);
        p.put("pageNo", String.valueOf(pageNo <= 0 ? 1 : pageNo));
        p.put("numOfRows", String.valueOf(numOfRows <= 0 ? 10 : numOfRows));
        return call("/getProgramSttusDetailInfoList02", p);
    }

    public Mono<String> convList(String instCode, int pageNo, int numOfRows) {
        Map<String,String> p = new LinkedHashMap<>();
        p.put("longTermAdminSym", instCode);
        p.put("pageNo", String.valueOf(pageNo <= 0 ? 1 : pageNo));
        p.put("numOfRows", String.valueOf(numOfRows <= 0 ? 10 : numOfRows));
        return call("/getConvInsttDetailInfoList02", p);
    }

    public Mono<String> etc(String instCode, String kindCode) {
        return call("/getInsttEtcDetailInfoItem02", Map.of(
                "longTermAdminSym", instCode,
                "adminPttnCd", kindCode
        ));
    }
}
