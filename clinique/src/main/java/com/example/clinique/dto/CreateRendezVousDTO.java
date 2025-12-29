package com.example.clinique.dto;

public class CreateRendezVousDTO {
    private String date;
    private String slot;
    private Long patientId;
    private Long doctorId;

    // Constructeurs
    public CreateRendezVousDTO() {}

    public CreateRendezVousDTO(String date, String slot, Long patientId, Long doctorId) {
        this.date = date;
        this.slot = slot;
        this.patientId = patientId;
        this.doctorId = doctorId;
    }

    // Getters et Setters
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getSlot() { return slot; }
    public void setSlot(String slot) { this.slot = slot; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    @Override
    public String toString() {
        return "CreateRendezVousDTO{" +
                "date='" + date + '\'' +
                ", slot='" + slot + '\'' +
                ", patientId=" + patientId +
                ", doctorId=" + doctorId +
                '}';
    }
}