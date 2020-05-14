package Gators.repository;

import Gators.model.Precinct;
import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PrecinctRepository extends JpaRepository<Precinct, Long> {
    Set<Precinct> findAllByNeighborsId(long id);

    Set<Precinct> findByState(State state);
}