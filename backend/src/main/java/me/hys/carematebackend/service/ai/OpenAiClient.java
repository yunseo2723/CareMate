package me.hys.carematebackend.service.ai;

import lombok.RequiredArgsConstructor;
import me.hys.carematebackend.dto.ai.OpenAiResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class OpenAiClient {

    private final WebClient openAiWebClient;

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
                .bodyToMono(OpenAiResponse.class)
                .map(res ->
                        res.output()
                                .get(0)
                                .content()
                                .get(0)
                                .text()
                )
                .block();
    }
}
