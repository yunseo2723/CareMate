package me.hys.carematebackend.service.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OpenAiClient {

    private final WebClient openAiWebClient;

    /** system + user를 합쳐 JSON만 반환 */
    public String chatJson(String system, String user) {

        String input = """
        [SYSTEM]
        %s

        [USER]
        %s
        """.formatted(system, user);

        Map<String, Object> body = Map.of(
                "model", "gpt-4.1-mini",
                "input", input
        );

        return openAiWebClient.post()
                .uri("/responses")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .map(res -> {
                    var output = (List<Map<String, Object>>) res.get("output");
                    var content = (List<Map<String, Object>>) output.get(0).get("content");
                    return content.get(0).get("text").toString();
                })
                .block();
    }
}
