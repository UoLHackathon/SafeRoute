package com.example.saferoute.dto;

public class HeatmapPointDto {
    private Double latitude;
    private Double longitude;
    private Double weight;

    public HeatmapPointDto() {}

    public HeatmapPointDto(Double latitude, Double longitude, Double weight) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.weight = weight;
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
}
