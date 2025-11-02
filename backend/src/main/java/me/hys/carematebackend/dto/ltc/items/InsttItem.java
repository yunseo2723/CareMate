package me.hys.carematebackend.dto.ltc.items;
import lombok.Data;

@Data
public class InsttItem {
    private Integer prsnRoomReal1;     // 1인실
    private Integer prsnRoomReal2;     // 2인실
    private Integer prsnRoomReal3;     // 3인실
    private Integer prsnRoomReal4;     // 4인실
    private Integer spcAcupRoomReal;   // 특수침실
    private Integer funcTrnRoomReal;   // 작업/ADL 훈련실
    private Integer pgmRoomReal;       // 프로그램실
    private Integer crmnyPrst;         // 식당/조리실
    private Integer batRoom;           // 화장실
    private Integer taxPageLong;       // 세면장/목욕실
    private Integer taxRoom;           // 세탁/건조장
}
