package me.hys.carematebackend.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ai.AiRecommendRequest;
import me.hys.carematebackend.dto.ai.AiRecommendResponse;
import me.hys.carematebackend.model.LtcFacility; // 너희 엔티티에 맞춰 import 수정
import me.hys.carematebackend.repository.LtcFacilityRepository; // 실제 레포 경로 맞춰
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiRecommendService {

    private final OpenAiClient openAi;
    private final ObjectMapper om;
    private final LtcFacilityRepository ltcFacilityRepository;

    public AiRecommendResponse recommend(AiRecommendRequest req) {

        // ✅ 후보 수 줄이기 (강력 권장)
        List<LtcFacility> candidates =
                ltcFacilityRepository.findTop200ByOrderByInstCodeAsc();

        String candText = candidates.stream()
                .map(f -> String.format(
                        "- instCode=%s | kindCode=%s | name=%s | addr=%s",
                        safe(f.getInstCode()),
                        safe(f.getKindCode()),
                        safe(f.getName()),
                        safe(f.getFullRoadNm())
                ))
                .collect(Collectors.joining("\n"));

        String system = """
                너는 요양원 추천 AI다.
                제공된 후보 목록 안에서만 추천한다.
                반드시 JSON만 출력한다. 설명, 마크다운 금지.

                JSON 스키마:
                {
                  "normalizedNeed": "요구사항 요약",
                  "items":[
                    {
                      "instCode":"...",
                      "kindCode":"...",
                      "name":"...",
                      "address":"...",
                      "reason":"..."
                    }
                  ]
                }

                items는 최대 5개.
                """;

        String filterJson;
        try {
            filterJson = om.writeValueAsString(req.getFilter());
        } catch (Exception e) {
            filterJson = "{}";
        }

        String user = """
                [사용자 요구]
                %s

                [현재 필터]
                %s

                [후보 목록]
                %s
                """.formatted(
                req.getMessage(),
                filterJson,
                candText
        );

        String content = openAi.chatJson(system, user);

        try {
            return om.readValue(content, AiRecommendResponse.class);
        } catch (Exception e) {
            return new AiRecommendResponse(
                    "추천 결과 파싱 실패",
                    List.of()
            );
        }
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
