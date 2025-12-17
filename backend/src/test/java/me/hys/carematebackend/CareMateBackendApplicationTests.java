package me.hys.carematebackend;

import me.hys.carematebackend.service.ai.AiRecommendService;
import me.hys.carematebackend.service.ai.OpenAiClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
class CareMateBackendApplicationTests {
    @Test
    void contextLoads() {
    }
    @MockitoBean
    AiRecommendService aiRecommendService;

    @MockitoBean
    OpenAiClient openAiClient;
}
