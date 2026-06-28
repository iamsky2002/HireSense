package com.sky.hiresense.ai;

import com.sky.hiresense.candidate.CandidateProfile;
import com.sky.hiresense.job.Job;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

// keeps job and candidate vectors in Qdrant up to date
@Service
public class AiIndexService {

    private static final Logger log = LoggerFactory.getLogger(AiIndexService.class);
    public static final String JOBS = "jobs";
    public static final String CANDIDATES = "candidates";
    private static final int VECTOR_SIZE = 768; // gemini-embedding-001 output dims

    private final GeminiEmbeddingClient gemini;
    private final QdrantClient qdrant;

    public AiIndexService(GeminiEmbeddingClient gemini, QdrantClient qdrant) {
        this.gemini = gemini;
        this.qdrant = qdrant;
    }

    public void indexJob(Job job) {
        if (!gemini.isEnabled()) return;
        try {
            qdrant.ensureCollection(JOBS, VECTOR_SIZE);
            qdrant.upsert(JOBS, job.getId(), gemini.embed(EmbeddingText.forJob(job)));
        } catch (Exception e) {
            // ai is best-effort, a failed embed should not break saving the job
            log.warn("could not index job {}", job.getId(), e);
        }
    }

    public void removeJob(long jobId) {
        if (!gemini.isEnabled()) return;
        try {
            qdrant.delete(JOBS, jobId);
        } catch (Exception e) {
            log.warn("could not remove job {} from index", jobId, e);
        }
    }

    public void indexCandidate(CandidateProfile profile) {
        if (!gemini.isEnabled()) return;
        try {
            qdrant.ensureCollection(CANDIDATES, VECTOR_SIZE);
            qdrant.upsert(CANDIDATES, profile.getUserId(), gemini.embed(EmbeddingText.forCandidate(profile)));
        } catch (Exception e) {
            log.warn("could not index candidate {}", profile.getUserId(), e);
        }
    }
}
