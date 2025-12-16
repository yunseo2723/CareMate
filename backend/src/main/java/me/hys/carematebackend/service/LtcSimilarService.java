package me.hys.carematebackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class LtcSimilarService {

    private final Map<String, Map<String, Object>> facilityById = new HashMap<>();

    @PostConstruct
    public void load() throws Exception {
        Path p = Path.of("data/output/facilities_final.json");
        String json = Files.readString(p);
        ObjectMapper om = new ObjectMapper();
        List<Map<String, Object>> list = om.readValue(json, new TypeReference<>() {});
        for (Map<String, Object> fac : list) {
            String instCode = (String) fac.get("instCode");
            facilityById.put(instCode, fac);
        }
        System.out.println("[LtcSimilarService] loaded " + facilityById.size() + " facilities");
    }

    // 유사 요양원 출력
    public List<Map<String, Object>> similar(String instCode) {
        Map<String, Object> fac = facilityById.get(instCode);
        if (fac == null) return Collections.emptyList();

        List<Map<String, Object>> sim = (List<Map<String, Object>>) fac.getOrDefault("similar", List.of());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> s : sim) {
            String otherId = (String) s.get("instCode");
            Map<String, Object> other = facilityById.get(otherId);
            if (other != null) {
                result.add(other);
            }
        }
        return result;
    }
}