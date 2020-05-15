package Gators.repository;

import Gators.model.Error.Error;
import Gators.model.Error.OverlappingError;
import Gators.model.Error.SparseOverlappingError;
import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface OverlappingErrorRepository extends JpaRepository<OverlappingError, Long> {
    Set<SparseOverlappingError> findByState(State state);
}