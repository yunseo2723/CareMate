package me.hys.carematebackend.service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class LtcSimilarService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ClassPathResource resource =
            new ClassPathResource("output/facilities_final.json");

    // 요청된 것만 캐시 (선택)
    private final Map<String, Map<String, Object>> cache = new HashMap<>();

    // =========================
    // 단일 시설 조회 (Streaming)
    // =========================
    public Map<String, Object> findByInstCode(String instCode) {
        if (cache.containsKey(instCode)) {
            return cache.get(instCode);
        }

        try (JsonParser parser =
                     objectMapper.getFactory().createParser(resource.getInputStream())) {

            // JSON이 배열이므로 START_ARRAY부터
            if (parser.nextToken() != JsonToken.START_ARRAY) {
                return null;
            }

            while (parser.nextToken() != JsonToken.END_ARRAY) {
                Map<String, Object> fac =
                        objectMapper.readValue(parser, new TypeReference<>() {});
                if (instCode.equals(fac.get("instCode"))) {
                    cache.put(instCode, fac); // 캐시
                    return fac;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return null;
    }

    // =========================
    // 유사 시설 조회
    // =========================
    public List<Map<String, Object>> similar(String instCode) {
        Map<String, Object> fac = findByInstCode(instCode);
        if (fac == null) return List.of();

        List<Map<String, Object>> sim =
                (List<Map<String, Object>>) fac.getOrDefault("similar", List.of());

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> s : sim) {
            String otherId = (String) s.get("instCode");
            Map<String, Object> other = findByInstCode(otherId);
            if (other != null) {
                result.add(other);
            }
        }

        return result;
    }
}
