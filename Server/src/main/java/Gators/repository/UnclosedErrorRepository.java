package Gators.repository;

import Gators.model.Error.SparseUnclosedError;
import Gators.model.Error.UnclosedError;
import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface UnclosedErrorRepository extends JpaRepository<UnclosedError, Long> {
    Set<SparseUnclosedError> findByStateAndFixed(State state, boolean fixed);
}