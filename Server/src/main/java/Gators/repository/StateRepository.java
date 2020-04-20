package Gators.repository;

import Gators.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateRepository extends JpaRepository<State, Long>
{
    State findByAbbr(String abbr);

    List<State> findAll();
}
