package Gators.repository;

import Gators.model.Precinct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrecinctRepository extends JpaRepository<Precinct, Long>
{

}
