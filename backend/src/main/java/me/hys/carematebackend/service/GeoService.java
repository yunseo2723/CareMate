package me.hys.carematebackend.service;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class GeoService {

    @Value("${ltc.api.rest-api-key}")
    private String kakaoApiKey;

    private WebClient web;

    @PostConstruct
    public void init() {
        this.web = WebClient.builder()
                .baseUrl("https://dapi.kakao.com")
                .defaultHeader("Authorization", "KakaoAK " + kakaoApiKey)
                .build();
    }

    public Coord resolve(String fullAddr) {
        if (fullAddr == null || fullAddr.isBlank()) return null;

        try {

            String query = fullAddr.replace(" ", "");

            Map<String, Object> res = web
                    .get()
                    .uri("/v2/local/search/address.json?query=" + query)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> docs = (List<Map<String, Object>>) Objects.requireNonNull(res).get("documents");
            if (docs == null || docs.isEmpty()) {
                System.out.println("⚠ Kakao returned empty");
                return null;
            }

            Map<String, Object> doc = docs.get(0);

            return new Coord(
                    Double.parseDouble(doc.get("y").toString()),
                    Double.parseDouble(doc.get("x").toString())
            );

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    @Data
    public static class Coord {
        private final Double lat;
        private final Double lng;
    }
}
