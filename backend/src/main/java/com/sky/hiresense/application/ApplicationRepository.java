package com.sky.hiresense.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // has this candidate already applied to this job?
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    List<Application> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);

    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
}
