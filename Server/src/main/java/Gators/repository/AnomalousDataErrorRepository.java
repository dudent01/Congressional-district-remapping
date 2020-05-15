package Gators.repository;

import Gators.model.Error.AnomalousDataError;
import Gators.model.Error.Error;
import Gators.model.Error.SparseAnomalousDataError;
import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface AnomalousDataErrorRepository extends JpaRepository<AnomalousDataError, Long> {
    Set<SparseAnomalousDataError> findByState(State state);
}