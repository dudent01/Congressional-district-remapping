package Gators.repository;

import Gators.model.Error.MultiPolygonError;
import Gators.model.Error.SparseMultiPolygonError;
import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface MultiPolygonErrorRepository extends JpaRepository<MultiPolygonError, Long> {
    Set<SparseMultiPolygonError> findByStateAndFixed(State state, boolean fixed);
}