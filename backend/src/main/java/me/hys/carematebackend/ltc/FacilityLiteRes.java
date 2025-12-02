package me.hys.carematebackend.ltc;

import lombok.Data;
import me.hys.carematebackend.model.LtcFacility;

@Data
public class FacilityLiteRes {
    private String id;       // instCode
    private String name;
    private String sido;     // siDoCd
    private String sgg;      // siGunGuCd
    private String postNo;
    private String address;
    private String phone;

    public static FacilityLiteRes from(LtcFacility f) {
        FacilityLiteRes r = new FacilityLiteRes();

        // 시설 고유 ID
        r.id = f.getInstCode();

        // 시설명
        r.name = (f.getName() != null && !f.getName().isBlank())
                ? f.getName()
                : f.getInstCode();   // 이름 없으면 시설코드라도 표시

        // 시/도
        r.sido = f.getSiDoCd();

        // 시/군/구
        r.sgg = f.getSiGunGuCd();

        // 우편번호
        r.postNo = f.getPostNo();

        // 도로명주소 → 지번주소 순서
//        if (f.getRoadAddr() != null && !f.getRoadAddr().isBlank()) {
            r.address = f.getRoadAddr();
//        } else {
//            r.address = f.getAddr();
//        }

        // 전화번호
        r.phone = f.getPhone();

        return r;
    }
}