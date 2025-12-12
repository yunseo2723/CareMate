package me.hys.carematebackend.dto.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import me.hys.carematebackend.model.SavedFilter;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SavedFilterDto {
    private Long id;
    private String name;
    private String filterJson;
    private LocalDateTime createdAt;

    public static SavedFilterDto from(SavedFilter f) {
        return new SavedFilterDto(
                f.getId(),
                f.getName(),
                f.getFilterJson(),
                f.getCreatedAt()
        );
    }
}
