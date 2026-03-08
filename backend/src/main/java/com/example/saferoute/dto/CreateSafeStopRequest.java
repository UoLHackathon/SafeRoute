package com.example.saferoute.dto;

import com.example.saferoute.enums.SafeStopCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public class CreateSafeStopRequest {

    @NotBlank
    private String name;

    @NotNull
    private SafeStopCategory category;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private LocalTime opensAt;
    private LocalTime closesAt;
    private Boolean is24Hours;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SafeStopCategory getCategory() {
        return category;
    }

    public void setCategory(SafeStopCategory category) {
        this.category = category;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalTime getOpensAt() {
        return opensAt;
    }

    public void setOpensAt(LocalTime opensAt) {
        this.opensAt = opensAt;
    }

    public LocalTime getClosesAt() {
        return closesAt;
    }

    public void setClosesAt(LocalTime closesAt) {
        this.closesAt = closesAt;
    }

    public Boolean getIs24Hours() {
        return is24Hours;
    }

    public void setIs24Hours(Boolean is24Hours) {
        this.is24Hours = is24Hours;
    }
}