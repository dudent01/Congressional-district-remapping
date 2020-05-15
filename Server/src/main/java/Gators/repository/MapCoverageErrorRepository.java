package Gators.repository;

import Gators.model.Error.MapCoverageError;
import Gators.model.Error.SparseMapCoverageError;
import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface MapCoverageErrorRepository extends JpaRepository<MapCoverageError, Long> {
    Set<SparseMapCoverageError> findByStateAndFixed(State state, boolean fixed);
}