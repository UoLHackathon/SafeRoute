package com.example.saferoute.dto;

import com.example.saferoute.enums.RouteMode;

public class CoordinateDto {

    private Double lat;
    private Double lng;

    public CoordinateDto() {
    }

    public CoordinateDto(Double lat, Double lng) {
        this.lat = lat;
        this.lng = lng;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }
}
