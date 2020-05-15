package Gators.repository;

import Gators.model.Error.EnclosedError;
import Gators.model.Error.Error;
import Gators.model.Error.SparseEnclosedError;
import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface EnclosedErrorRepository extends JpaRepository<EnclosedError, Long> {
    Set<SparseEnclosedError> findByState(State state);
}