package me.hys.carematebackend.mapper;

import me.hys.carematebackend.dto.community.NoticeDtos;
import me.hys.carematebackend.dto.community.TalkDtos;
import me.hys.carematebackend.model.Notice;
import me.hys.carematebackend.model.Talk;

public class CommunityMapper {
    public static NoticeDtos.Res toRes(Notice n){
        return new NoticeDtos.Res(
                n.getId(), n.getCareMateId(), n.getAuthorUserId(),
                n.getTitle(), n.getBody(), n.isPinned(),
                n.getCreatedAt(), n.getUpdatedAt()
        );
    }
    public static TalkDtos.Res toRes(Talk t){
        return new TalkDtos.Res(
                t.getId(), t.getCareMateId(), t.getAuthorUserId(),
                t.getBody(), t.getParentId(), t.getCreatedAt()
        );
    }
}
