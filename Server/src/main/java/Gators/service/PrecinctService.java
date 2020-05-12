package Gators.service;

import Gators.model.Demographic.Demographic;
import Gators.model.Precinct;
import Gators.repository.PrecinctRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Set;

@Service
public class PrecinctService {
    private final PrecinctRepository precinctRepository;

    @Autowired
    public PrecinctService(PrecinctRepository precinctRepository) {
        this.precinctRepository = precinctRepository;
    }

    @Transactional
    public void addNeighborById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        precinct1.getNeighbors().add(precinct2);
        precinct2.getNeighbors().add(precinct1);

        precinctRepository.save(precinct1);
        precinctRepository.save(precinct2);
    }

    public Set<Precinct> getPrecinctsByStateAbbr(String stateAbbr) {
        return precinctRepository.findByStateAbbr(stateAbbr);
    }

    public Demographic getDemographicById(long id) {
        return precinctRepository.findById(id).orElse(null).getDemographic();
    }

    public Set<Precinct> getNeighborsById(long id) {
        return precinctRepository.findAllByNeighborsId(id);
    }

    public Collection getPres2016AndDemographicById(long id) {
        return new ArrayList(Arrays.asList(precinctRepository.findById(id).orElse(null).getPres2016(), precinctRepository.findById(id).orElse(null).getDemographic()));
    }

    @Transactional
    public void editGeojsonById(long id, String geojson) {
        Precinct precinct = precinctRepository.findById(id).orElse(null);
        precinct.setGeojson(geojson);
        precinctRepository.save(precinct);
    }

    @Transactional
    public void deleteNeighborById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        precinct1.getNeighbors().remove(precinct2);
        precinct2.getNeighbors().remove(precinct1);

        precinctRepository.save(precinct1);
        precinctRepository.save(precinct2);
    }
}
