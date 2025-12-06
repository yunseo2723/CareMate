package me.hys.carematebackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@Service
public class RoadnameResolver {

    private final Map<String, String> roadMap;

    public RoadnameResolver() throws Exception {
        Path p = Path.of("data/output/roadname_map.json");
        String json = Files.readString(p);
        ObjectMapper om = new ObjectMapper();
        roadMap = om.readValue(json, new TypeReference<>() {});
    }

    public String resolve(String roadCode) {
        if (roadCode == null || roadCode.isBlank()) return "";
        return roadMap.getOrDefault(roadCode, "");
    }
}
