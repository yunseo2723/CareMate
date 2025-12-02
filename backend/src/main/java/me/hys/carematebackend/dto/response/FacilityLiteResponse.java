package me.hys.carematebackend.dto.response;

import lombok.Data;
import me.hys.carematebackend.model.LtcFacility;

@Data
public class FacilityLiteResponse {
    private String id;
    private String name;
    private String address;
    private String phone;
    private String siDoCd;
    private String siGunGuCd;

    public static FacilityLiteResponse from(LtcFacility f) {
        FacilityLiteResponse r = new FacilityLiteResponse();
        r.id = f.getInstCode();
        r.name = f.getName();
        r.address = f.getRoadAddr();
        r.phone = f.getPhone();
        r.siDoCd = f.getSiDoCd();
        r.siGunGuCd = f.getSiGunGuCd();
        return r;
    }
}
