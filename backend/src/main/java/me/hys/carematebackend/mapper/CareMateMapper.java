package me.hys.carematebackend.mapper;

import me.hys.carematebackend.dto.caremate.CareMateCardRes;
import me.hys.carematebackend.dto.caremate.CareMateDetailRes;
import me.hys.carematebackend.model.CareMate;

import java.util.Map;

public class CareMateMapper {
    public static CareMateCardRes toCard(CareMate e, Double distanceKm) {
        return new CareMateCardRes(
                e.getId(), e.getName(), e.getRegion(),
                e.getMonthlyFeeMin(), e.getRating(),
                distanceKm, e.getSpecialties(),
                (e.getPhotos().isEmpty() ? null : e.getPhotos().get(0))
        );
    }
    public static CareMateDetailRes toDetail(CareMate e) {
        Map<String, Integer> fee = new java.util.HashMap<>();
        if (e.getMonthlyFeeMin() != null) fee.put("min", e.getMonthlyFeeMin());
        if (e.getMonthlyFeeMax() != null) fee.put("max", e.getMonthlyFeeMax());

        return new CareMateDetailRes(
                e.getId(), e.getName(), e.getRegion(), e.getAddress(), e.getPhone(),
                fee.isEmpty() ? null : fee,
                e.getNurseRatio(), e.getRating(),
                nonNullList(e.getSpecialties()),
                nonNullList(e.getPrograms()),
                nonNullList(e.getPhotos()),
                e.getLat(), e.getLng()
        );
    }

    private static <T> java.util.List<T> nonNullList(java.util.List<T> v) {
        return v == null ? java.util.Collections.emptyList() : v;
    }

}
