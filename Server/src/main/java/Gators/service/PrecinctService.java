package Gators.service;

import Gators.model.Demographic.Demographic;
import Gators.model.Precinct;
import Gators.repository.Repositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class PrecinctService {
    private final Repositories repositories;

    @Autowired
    public PrecinctService(Repositories repositories) {
        this.repositories = repositories;
    }

    @Transactional
    public void addNeighborById(long id1, long id2) {
        Precinct precinct1 = repositories.getPrecinctRepository().findById(id1).orElse(null);
        Precinct precinct2 = repositories.getPrecinctRepository().findById(id2).orElse(null);

        precinct1.getNeighbors().add(precinct2);
        precinct2.getNeighbors().add(precinct1);

        repositories.getPrecinctRepository().save(precinct1);
        repositories.getPrecinctRepository().save(precinct2);
    }

    public Set<Precinct> getPrecinctsByStateAbbr(String stateAbbr) {
        return repositories.getPrecinctRepository().findByStateAbbr(stateAbbr);
    }

    public Demographic getDemographicById(long id) {
        return repositories.getPrecinctRepository().findById(id).orElse(null).getDemographic();
    }

    public Set<Precinct> getNeighborsById(long id) {
        return repositories.getPrecinctRepository().findAllByNeighborsId(id);
    }
}
