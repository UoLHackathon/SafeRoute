package com.example.saferoute.dto;

import com.example.saferoute.enums.RouteMode;

import java.util.List;

public class RouteResponse {

    private RouteMode mode;
    private Double distanceMeters;
    private Double durationSeconds;
    private Double riskScore;
    private String confidence;
    private List<String> reasons;
    private List<CoordinateDto> path;

    public RouteMode getMode() {
        return mode;
    }

    public void setMode(RouteMode mode) {
        this.mode = mode;
    }

    public Double getDistanceMeters() {
        return distanceMeters;
    }

    public void setDistanceMeters(Double distanceMeters) {
        this.distanceMeters = distanceMeters;
    }

    public Double getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Double durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Double riskScore) {
        this.riskScore = riskScore;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public List<CoordinateDto> getPath() {
        return path;
    }

    public void setPath(List<CoordinateDto> path) {
        this.path = path;
    }
}
