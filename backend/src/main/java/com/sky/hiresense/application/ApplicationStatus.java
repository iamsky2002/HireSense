package com.sky.hiresense.application;

// hiring pipeline order; REJECTED can happen at any stage.
// stored as STRING, so adding values here is safe for existing rows.
public enum ApplicationStatus {
    APPLIED,
    UNDER_REVIEW,
    SHORTLISTED,
    ASSESSMENT,
    INTERVIEW,
    OFFERED,
    HIRED,
    REJECTED
}
