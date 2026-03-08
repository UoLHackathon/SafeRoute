package com.example.saferoute.dto;

public class IncidentReportDto {
    private String id;
    private Double latitude;
    private Double longitude;
    private String type;
    private String timestamp;
    private String description;

    public IncidentReportDto() {}

    public IncidentReportDto(String id, Double latitude, Double longitude, String type, String timestamp, String description) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.timestamp = timestamp;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
