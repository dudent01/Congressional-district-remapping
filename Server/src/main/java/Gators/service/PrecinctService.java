package Gators.service;

import Gators.model.Election.Election;
import Gators.model.Precinct;
import Gators.repository.Repositories;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PrecinctService
{
    @Transactional
    public void addNeighborById(long id1, long id2)
    {
        Precinct precinct1 = Repositories.precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = Repositories.precinctRepository.findById(id2).orElse(null);

        precinct1.getNeighbors().add(precinct2);
        precinct2.getNeighbors().add(precinct1);

        Repositories.precinctRepository.save(precinct1);
        Repositories.precinctRepository.save(precinct2);
    }

    public Set<Precinct> getPrecinctsByStateId(long stateId)
    {
        Set<Precinct> set = Repositories.precinctRepository.findByStateId(stateId);
        set.stream().forEach(precinct -> precinct.setCong2016(new Election()));
        return set;
    }
}
