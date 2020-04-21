package Gators.repository;

import Gators.model.Precinct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PrecinctRepository extends JpaRepository<Precinct, Long> {
    Set<Precinct> findByStateAbbr(String stateAbbr);

    Set<Precinct> findAllByNeighborsId(long id);
}