package com.sky.hiresense.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    // agar param null hai to (:param IS NULL OR ...) wo filter skip kar deta hai, ek hi query me saare combos cover ho jate hain
    @Query("""
            SELECT j FROM Job j
            WHERE (:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%')))
              AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
              AND (:type IS NULL OR j.type = :type)
            """)
    Page<Job> search(@Param("title") String title,
                     @Param("location") String location,
                     @Param("type") EmploymentType type,
                     Pageable pageable);

    // employer's jobs, latest first; CompanyOwnerId = job.company.owner.id
    List<Job> findByCompanyOwnerIdOrderByPostedAtDesc(Long ownerId);
}
