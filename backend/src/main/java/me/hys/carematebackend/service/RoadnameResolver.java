package me.hys.carematebackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class RoadnameResolver {

    private final Map<String, String> roadMap;

    public RoadnameResolver() throws Exception {
        ClassPathResource resource =
                new ClassPathResource("output/roadname_map.json");

        try (InputStream is = resource.getInputStream()) {
            String json = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            ObjectMapper om = new ObjectMapper();
            roadMap = om.readValue(json, new TypeReference<>() {});
        }
    }

    public String resolve(String roadCode) {
        if (roadCode == null || roadCode.isBlank()) return "";
        return roadMap.getOrDefault(roadCode, "");
    }
}
