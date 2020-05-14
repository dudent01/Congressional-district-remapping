package Gators.repository;

import Gators.model.Election.CandidateResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateResultRepository extends JpaRepository<CandidateResult, Long> {
}