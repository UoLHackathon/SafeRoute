package com.example.saferoute.model;

import com.example.saferoute.enums.SafeStopCategory;
import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
public class SafeStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private SafeStopCategory category;

    private Double latitude;
    private Double longitude;

    @Column(name = "opens_at")
    private LocalTime opensAt;

    @Column(name = "closes_at")
    private LocalTime closesAt;

    @Column(name = "is_24_hours")
    private Boolean is_24Hours;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Boolean getis_24Hours() {
        return is_24Hours;
    }

    public void setis_24Hours(Boolean is_24Hours) {
        this.is_24Hours = is_24Hours;
    }
}
