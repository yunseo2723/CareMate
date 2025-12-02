package me.hys.carematebackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LtcSimilarService {

    private final Map<String, Map<String, Object>> facilityById = new HashMap<>();

    @PostConstruct
    public void load() throws Exception {
        Path p = Path.of("data/output/facilities_with_sim.json");
        String json = Files.readString(p);
        ObjectMapper om = new ObjectMapper();
        List<Map<String, Object>> list = om.readValue(json, new TypeReference<>() {});
        for (Map<String, Object> fac : list) {
            String instCode = (String) fac.get("instCode");
            facilityById.put(instCode, fac);
        }
        System.out.println("[LtcSimilarService] loaded " + facilityById.size() + " facilities");
    }

    // 실시간: 조건으로 필터링
    public List<Map<String, Object>> search(int topN) {
        return facilityById.values().stream()
                .limit(topN)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> findAll() {
        return new ArrayList<>(facilityById.values());
    }

    // “비슷한 요양원” 뿌리기
    public List<Map<String, Object>> similar(String instCode, int topN) {
        Map<String, Object> fac = facilityById.get(instCode);
        if (fac == null) return Collections.emptyList();
        List<Map<String, Object>> sim = (List<Map<String, Object>>) fac.getOrDefault("similar", List.of());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> s : sim.stream().limit(topN).toList()) {
            String otherId = (String) s.get("instCode");
            Map<String, Object> other = facilityById.get(otherId);
            if (other != null) {
                result.add(other);
            }
        }
        return result;
    }
}