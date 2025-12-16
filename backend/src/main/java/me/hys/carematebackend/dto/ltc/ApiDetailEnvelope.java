package me.hys.carematebackend.dto.ltc;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

import java.util.List;

/**
 * 상세 API 공통 래퍼
 * 실제 XML:
 * <response>
 *   <header>...</header>
 *   <body>
 *     <item> ... </item>
 *   </body>
 * </response>
 */
@Data
@JacksonXmlRootElement(localName = "response")
public class ApiDetailEnvelope<T> {

    private Header header;
    private DetailBody<T> body;

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class DetailBody<T> {

        // body 바로 아래에 item 반복
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "item")
        private List<T> item;
    }
}
