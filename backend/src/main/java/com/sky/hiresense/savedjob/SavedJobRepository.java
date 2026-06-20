package com.sky.hiresense.savedjob;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    void deleteByJobIdAndCandidateId(Long jobId, Long candidateId);

    List<SavedJob> findByCandidateIdOrderBySavedAtDesc(Long candidateId);
}
