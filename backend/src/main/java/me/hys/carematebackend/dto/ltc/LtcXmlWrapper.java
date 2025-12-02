package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class LtcXmlWrapper<T> {

    private Header header;
    private Body<T> body;

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class Body<T> {
        private T item;
    }
}
