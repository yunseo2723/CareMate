package me.hys.carematebackend;

import me.hys.carematebackend.service.ai.AiRecommendService;
import me.hys.carematebackend.service.ai.OpenAiClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
@MockBean(OpenAiClient.class)
@MockBean(AiRecommendService.class)
class CareMateBackendApplicationTests {
    @Test
    void contextLoads() {
    }
}
