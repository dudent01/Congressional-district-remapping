package Gators.service;

import Gators.model.Demographic.Demographic;
import Gators.model.Election.CandidateResult;
import Gators.model.Election.Election;
import Gators.model.Election.ElectionParty;
import Gators.model.Election.ElectionType;
import Gators.model.Precinct;
import Gators.repository.Repositories;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class PrecinctService {
    @Transactional
    public void addNeighborById(long id1, long id2) {
        Precinct precinct1 = Repositories.precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = Repositories.precinctRepository.findById(id2).orElse(null);

        precinct1.getNeighbors().add(precinct2);
        precinct2.getNeighbors().add(precinct1);

        Repositories.precinctRepository.save(precinct1);
        Repositories.precinctRepository.save(precinct2);
    }

    public Set<Precinct> getPrecinctsByStateId(String stateAbbr) {
//        return Repositories.precinctRepository.findByStateId(stateId);

        // TODO delete all after this later(dummy data)
        Set<Precinct> set = Repositories.precinctRepository.findByStateAbbr(stateAbbr);
        CandidateResult result = new CandidateResult();
        result.setName("John Doe");
        result.setParty(ElectionParty.OTHER);
        result.setVotes(421);

        Election election16 = new Election();
        election16.setType(ElectionType.CONGRESSIONAL_2016);
        election16.setResults((new HashSet<CandidateResult>()));
        election16.getResults().add(result);
        election16.setWinner(result);

        Election election18 = new Election();
        election18.setType(ElectionType.CONGRESSIONAL_2018);
        election18.setResults((new HashSet<CandidateResult>()));
        election18.getResults().add(result);
        election18.setWinner(result);

        Election election16p = new Election();
        election16p.setType(ElectionType.PRESIDENTIAL_2016);
        election16p.setResults((new HashSet<CandidateResult>()));
        election16p.getResults().add(result);
        election16p.setWinner(result);

        Demographic demo = new Demographic();
        demo.setTotalPop(800);
        demo.setWhitePop(400);
        demo.setBlackPop(200);
        demo.setHispanicPop(100);
        demo.setAsianPop(50);
        demo.setOtherPop(50);

        set.stream().forEach(precinct -> precinct.setCong2016(election16));
        set.stream().forEach(precinct -> precinct.setCong2018(election18));
        set.stream().forEach(precinct -> precinct.setPres2016(election16p));
        set.stream().forEach(precinct -> precinct.setDemographic(demo));
        set.stream().forEach(precinct -> precinct.setCName("Default"));

        return set;
    }

    public Demographic getDemographicById(long id) {
        return Repositories.precinctRepository.findById(id).orElse(null).getDemographic();
    }

    public Set<Precinct> getNeighborsById(long id) {
        return Repositories.precinctRepository.findAllByNeighborsId(id);
    }
}
