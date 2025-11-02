package me.hys.carematebackend.dto.ltc;

import lombok.Data;

@Data
public class RoomsDto {
    private Integer prsnRoomreal1;     // 1인실
    private Integer prsnRoomreal2;     // 2인실
    private Integer prsnRoomreal3;     // 3인실
    private Integer prsnRoomreal4;     // 4인실
    private Integer spcAcupRoomreal;   // 특수침실
    private Integer funcTrnRoomreal;   // 작업/일상동작훈련실
    private Integer pgmRoomreal;       // 프로그램실
    private Integer crmnyPrst;         // 식당 및 조리실
    private Integer batRoom;           // 화장실
    private Integer taxPageLong;       // 세면·목욕실
    private Integer taxRoom;           // 세탁·건조장
}
