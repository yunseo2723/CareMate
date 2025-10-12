package me.hys.carematebackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "caremates")
@Getter @Setter
public class CareMate {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)       private String name;     // 요양원명
    @Column(nullable=false)       private String region;   // 예: "서울 강남구"

    // 공공데이터 전화번호(지역/국번/번호)
    @Column(name="loc_tel_no1")   private String locTelNo1;  // 예: 02
    @Column(name="loc_tel_no2")   private String locTelNo2;  // 예: 980
    @Column(name="loc_tel_no3")   private String locTelNo3;  // 예: 3004

    // 필요하면 추가 필드
    private String address;
    private String phone;          // 전체 문자열 보관용(선택)
    private Double lat;
    private Double lng;
    private Double rating;
    private Integer monthlyFeeMin;
    private Integer monthlyFeeMax;
}
