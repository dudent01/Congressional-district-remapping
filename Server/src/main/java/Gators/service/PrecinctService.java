package Gators.service;

import Gators.model.Precinct;
import Gators.repository.Repositories;
import org.springframework.stereotype.Service;

@Service
public class PrecinctService
{
    public void addPrecinct(Precinct precinct)
    {
        Repositories.precinctRepository.save(precinct);
    }

    public Precinct getPrecinctById(Long precinctId)
    {
        return Repositories.precinctRepository.findById(precinctId).orElse(null);
    }

}
