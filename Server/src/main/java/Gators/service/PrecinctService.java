package Gators.service;

import Gators.model.Demographic.Demographic;
import Gators.model.Error.Log;
import Gators.model.Precinct;
import Gators.repository.LogRepository;
import Gators.repository.PrecinctRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PrecinctService {
    private final PrecinctRepository precinctRepository;
    private final LogRepository logRepository;

    @Autowired
    public PrecinctService(PrecinctRepository precinctRepository, LogRepository logRepository) {
        this.precinctRepository = precinctRepository;
        this.logRepository = logRepository;
    }

    @Transactional
    public void addNeighborById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        Log log1 = new Log();
        log1.setLogDate(new Date());
        log1.setPrecinct(precinct1);
        log1.setOldData(precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        Log log2 = new Log();
        log2.setLogDate(new Date());
        log2.setPrecinct(precinct2);
        log2.setOldData(precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        precinct1.getNeighbors().add(precinct2);
        precinct2.getNeighbors().add(precinct1);

        log1.setNewData(precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());
        log2.setNewData(precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        precinctRepository.save(precinct1);
        precinctRepository.save(precinct2);

        logRepository.save(log1);
        logRepository.save(log2);
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

        Log log = new Log();
        log.setLogDate(new Date());
        log.setPrecinct(precinct);
        log.setOldData(precinct.getGeojson());

        precinct.setGeojson(geojson);

        log.setNewData(precinct.getGeojson());

        precinctRepository.save(precinct);

        logRepository.save(log);
    }

    @Transactional
    public void deleteNeighborById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        Log log1 = new Log();
        log1.setLogDate(new Date());
        log1.setPrecinct(precinct1);
        log1.setOldData(precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        Log log2 = new Log();
        log2.setLogDate(new Date());
        log2.setPrecinct(precinct2);
        log2.setOldData(precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        precinct1.getNeighbors().remove(precinct2);
        precinct2.getNeighbors().remove(precinct1);

        log1.setNewData(precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());
        log2.setNewData(precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        precinctRepository.save(precinct1);
        precinctRepository.save(precinct2);

        logRepository.save(log1);
        logRepository.save(log2);
    }
}
