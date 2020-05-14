package Gators.service;

import Gators.model.Demographic.Demographic;
import Gators.model.Election.CandidateResult;
import Gators.model.Election.Election;
import Gators.model.Election.ElectionType;
import Gators.model.Error.Log;
import Gators.model.Precinct;
import Gators.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryCollection;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.io.geojson.GeoJsonReader;
import org.locationtech.jts.io.geojson.GeoJsonWriter;
import org.locationtech.jts.operation.buffer.BufferOp;
import org.locationtech.jts.operation.buffer.BufferParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PrecinctService {
    private final PrecinctRepository precinctRepository;
    private final LogRepository logRepository;
    private final ElectionRepository electionRepository;
    private final CandidateResultRepository candidateResultRepository;
    private final StateRepository stateRepository;
    private final DemographicRepository demographicRepository;
    private final ObjectMapper mapper;

    @Autowired
    public PrecinctService(PrecinctRepository precinctRepository, LogRepository logRepository, ElectionRepository electionRepository, CandidateResultRepository candidateResultRepository, StateRepository stateRepository, DemographicRepository demographicRepository) {
        this.precinctRepository = precinctRepository;
        this.logRepository = logRepository;
        this.electionRepository = electionRepository;
        this.candidateResultRepository = candidateResultRepository;
        this.stateRepository = stateRepository;
        this.demographicRepository = demographicRepository;
        mapper = new ObjectMapper();
    }

    @Transactional
    public void addNeighborById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        Log log1 = new Log(precinct1, "Add Neighbor");
        Log log2 = new Log(precinct2, "Add Neighbor");
        log1.setOldData(
                precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());
        log2.setOldData(
                precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        precinct1.getNeighbors().add(precinct2);
        precinct2.getNeighbors().add(precinct1);

        log1.setNewData(
                precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());
        log2.setNewData(
                precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

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

    public Collection<?> getPres2016AndDemographicById(long id) {
        return new ArrayList<>(Arrays.asList(precinctRepository.findById(id).orElse(null).getPres2016(),
                precinctRepository.findById(id).orElse(null).getDemographic()));
    }

    public Collection<?> getCong2016AndDemographicById(long id) {
        return new ArrayList<>(Arrays.asList(precinctRepository.findById(id).orElse(null).getCong2016(),
                precinctRepository.findById(id).orElse(null).getDemographic()));
    }

    public Collection<?> getCong2018AndDemographicById(long id) {
        return new ArrayList<>(Arrays.asList(precinctRepository.findById(id).orElse(null).getCong2018(),
                precinctRepository.findById(id).orElse(null).getDemographic()));
    }

    @Transactional
    public void editGeojsonById(long id, String geojson) {
        Precinct precinct = precinctRepository.findById(id).orElse(null);

        Log log = new Log(precinct, "Edit GeoJson");
        log.setOldData(precinct.getGeojson());

        precinct.setGeojson(geojson);

        log.setNewData(precinct.getGeojson());

        logRepository.save(log);
    }

    @Transactional
    public void deleteNeighborById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        Log log1 = new Log(precinct1, "Delete Neighbor");
        Log log2 = new Log(precinct2, "Delete Neighbor");
        log1.setOldData(
                precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());
        log2.setOldData(
                precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        precinct1.getNeighbors().remove(precinct2);
        precinct2.getNeighbors().remove(precinct1);

        log1.setNewData(
                precinct1.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());
        log2.setNewData(
                precinct2.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString());

        logRepository.save(log1);
        logRepository.save(log2);
    }

    @SneakyThrows
    @Transactional
    public Precinct mergePrecinctsById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        Log log = new Log(precinct1, "Merge Precincts");

        log.setOldData(stringifyPrecinct(precinct2));

        JsonParser springParser = JsonParserFactory.getJsonParser();
        Map<String, Object> precinct1Map = springParser.parseMap(precinct1.getGeojson());
        Map<String, Object> precinct2Map = springParser.parseMap(precinct2.getGeojson());

        String precinct1Json;
        String precinct2Json;

        precinct1Json = mapper.writeValueAsString(precinct1Map.get("geometry"));
        precinct2Json = mapper.writeValueAsString(precinct2Map.get("geometry"));

        Collection<Geometry> geometryList = new LinkedList<>();
        GeoJsonReader geoJsonReader = new GeoJsonReader();
        Geometry g1, g2;
        g1 = inflate(geoJsonReader.read(precinct1Json));
        g2 = inflate(geoJsonReader.read(precinct2Json));

        Collections.addAll(geometryList, g1, g2);
        GeometryFactory geometryFactory = new GeometryFactory();
        Object obj = geometryFactory.buildGeometry(geometryList);
        GeometryCollection geometryCollection = (GeometryCollection) obj;
        Geometry union = geometryCollection.union();  //perform union
        String str = new GeoJsonWriter().write(deflate(union));
        precinct1Map.put("geometry", springParser.parseMap(str));

        String newGeojson;
        newGeojson = new ObjectMapper().writeValueAsString(precinct1Map);

        precinct1.setGeojson(newGeojson);

        if (precinct1.getDemographic() == null && precinct2.getDemographic() != null) {
            precinct1.setDemographic(new Demographic());
            demographicRepository.save(precinct1.getDemographic());
        }
        mergeDemographics(precinct1.getDemographic(), precinct2.getDemographic());

        if (precinct1.getPres2016() == null && precinct2.getPres2016() != null) {
            precinct1.setPres2016(new Election(ElectionType.PRESIDENTIAL_2016));
            electionRepository.save(precinct1.getPres2016());
        }

        if (precinct1.getCong2016() == null && precinct2.getCong2016() != null) {
            precinct1.setCong2016(new Election(ElectionType.CONGRESSIONAL_2016));
            electionRepository.save(precinct1.getCong2016());
        }

        if (precinct1.getCong2018() == null && precinct2.getCong2018() != null) {
            precinct1.setCong2018(new Election(ElectionType.CONGRESSIONAL_2018));
            electionRepository.save(precinct1.getCong2018());
        }

        mergeElections(precinct1.getPres2016(), precinct2.getPres2016());
        mergeElections(precinct1.getCong2016(), precinct2.getCong2016());
        mergeElections(precinct1.getCong2018(), precinct2.getCong2018());

        precinct1.setCName(precinct1.getCName() + " + " + precinct2.getCName());
        precinct1.setName(precinct1.getName() + " + " + precinct2.getName());
        precinct1.getNeighbors().addAll(precinct2.getNeighbors());
        precinct1.getNeighbors().remove(precinct1);

        for (Precinct p : precinct2.getNeighbors()) {
            p.getNeighbors().add(precinct1);
            p.getNeighbors().remove(precinct2);
        }

        precinctRepository.delete(precinct2);
        precinct2.getNeighbors().clear();

        log.setNewData(stringifyPrecinct(precinct1));

        logRepository.save(log);

        return precinct1;
    }

    @Transactional
    public void editPrecinctNames(long id, String name, String cName) {
        Precinct precinct = precinctRepository.findById(id).orElse(null);

        Log log = new Log(precinct, "Edit Precinct Names");

        log.setOldData("name : " + precinct.getName() + "\ncName : " + precinct.getCName());

        precinct.setName(name);
        precinct.setCName(cName);

        log.setOldData("name : " + precinct.getName() + "\ncName : " + precinct.getCName());

        logRepository.save(log);
    }

    @SneakyThrows
    @Transactional
    public void editElection(long id, Election election) {
        Precinct precinct = precinctRepository.findById(id).orElse(null);

        Log log = new Log(precinct, "Edit Election");
        switch (election.getType()) {
        case PRESIDENTIAL_2016:
            if (precinct.getPres2016() == null) {
                precinct.setPres2016(new Election(ElectionType.PRESIDENTIAL_2016));
                electionRepository.save(precinct.getPres2016());
            }
            log.setOldData(mapper.writeValueAsString(precinct.getPres2016()));
            writeElection(precinct.getPres2016(), election);
            log.setNewData(mapper.writeValueAsString(precinct.getPres2016()));
            break;
        case CONGRESSIONAL_2016:
            if (precinct.getCong2016() == null) {
                precinct.setCong2016(new Election(ElectionType.CONGRESSIONAL_2016));
                electionRepository.save(precinct.getCong2016());
            }
            log.setOldData(mapper.writeValueAsString(precinct.getCong2016()));
            writeElection(precinct.getCong2016(), election);
            log.setNewData(mapper.writeValueAsString(precinct.getCong2016()));
            break;
        case CONGRESSIONAL_2018:
            if (precinct.getCong2018() == null) {
                precinct.setCong2018(new Election(ElectionType.CONGRESSIONAL_2018));
                electionRepository.save(precinct.getCong2018());
            }
            log.setOldData(mapper.writeValueAsString(precinct.getCong2018()));
            writeElection(precinct.getCong2018(), election);
            log.setNewData(mapper.writeValueAsString(precinct.getCong2018()));
            break;
        }

        logRepository.save(log);
    }

    @Transactional
    public Precinct generatePrecinct(String stateAbbr, String geojson) {
        Precinct precinct = new Precinct();
        precinctRepository.save(precinct);
        precinct.setGeojson(geojson);
        precinct.setName(Long.toString(precinct.getId()));
        precinct.setCName(Long.toString(precinct.getId()));
        precinct.setState(stateRepository.findByAbbr(stateAbbr));
        precinct.setDemographic(new Demographic());
        demographicRepository.save(precinct.getDemographic());

        Log log = new Log(precinct, "Generate Precinct");
        logRepository.save(log);
        log.setOldData("");
        log.setNewData(stringifyPrecinct(precinct));
        return precinct;
    }

    @SneakyThrows
    @Transactional
    public void editDemographic(long id, Demographic demographic) {
        Precinct precinct = precinctRepository.findById(id).orElse(null);

        Log log = new Log(precinct, "Edit Demographic");
        if (precinct.getDemographic() == null) {
            precinct.setDemographic(new Demographic());
            demographicRepository.save(precinct.getDemographic());
        }
        log.setOldData(mapper.writeValueAsString(precinct.getDemographic()));
        writeDemograpic(precinct.getDemographic(), demographic);
        log.setNewData(mapper.writeValueAsString(precinct.getDemographic()));

        logRepository.save(log);
    }

    private Geometry deflate(Geometry geom) {
        BufferParameters bufferParameters = new BufferParameters();
        bufferParameters.setEndCapStyle(BufferParameters.CAP_ROUND);
        bufferParameters.setJoinStyle(BufferParameters.JOIN_MITRE);
        Geometry buffered = BufferOp.bufferOp(geom, -.0001, bufferParameters);
        buffered.setUserData(geom.getUserData());
        return buffered;
    }

    private Geometry inflate(Geometry geom) {
        BufferParameters bufferParameters = new BufferParameters();
        bufferParameters.setEndCapStyle(BufferParameters.CAP_ROUND);
        bufferParameters.setJoinStyle(BufferParameters.JOIN_MITRE);
        Geometry buffered = BufferOp.bufferOp(geom, .0001, bufferParameters);
        buffered.setUserData(geom.getUserData());
        return buffered;
    }

    private void mergeElections(Election election1, Election election2) {
        if (election2 == null) {
            return;
        }

        for (CandidateResult cr2 : election2.getResults()) {
            boolean inCrs1 = false;
            for (CandidateResult cr1 : election1.getResults()) {
                if (cr2.getName().equals(cr1.getName())) {
                    cr1.setVotes(cr1.getVotes() + cr2.getVotes());
                    inCrs1 = true;
                    break;
                }
            }
            if (!inCrs1) {
                CandidateResult result = new CandidateResult(cr2.getName(), cr2.getParty(), cr2.getVotes(),
                        cr2.getElection());
                candidateResultRepository.save(result);
                election1.getResults().add(result);
            }
        }
    }

    private void mergeDemographics(Demographic demographic1, Demographic demographic2) {
        if (demographic2 == null) {
            return;
        }

        demographic1.setAsianPop(demographic1.getAsianPop() + demographic2.getAsianPop());
        demographic1.setBlackPop(demographic1.getBlackPop() + demographic2.getBlackPop());
        demographic1.setWhitePop(demographic1.getWhitePop() + demographic2.getWhitePop());
        demographic1.setHispanicPop(demographic1.getHispanicPop() + demographic2.getHispanicPop());
        demographic1.setOtherPop(demographic1.getOtherPop() + demographic2.getOtherPop());
    }

    @SneakyThrows
    private String stringifyPrecinct(Precinct precinct) {
        return mapper.writeValueAsString(precinct) +
                "\nneighbors : " + precinct.getNeighbors() == null ? "none" : precinct.getNeighbors().stream().map(Precinct::getCName).collect(Collectors.toSet()).toString() +
                precinct.getPres2016() == null ? "No presidential2016 data\n" : mapper.writeValueAsString(precinct.getPres2016()) +
                precinct.getCong2016() == null ? "No congressional2016 data\n" : mapper.writeValueAsString(precinct.getCong2016()) +
                precinct.getCong2018() == null ? "No congressional2018 data\n" : mapper.writeValueAsString(precinct.getCong2018()) +
                precinct.getDemographic() == null ? "No demographic data\n" : mapper.writeValueAsString(precinct.getDemographic()) +
                "\nstate : " + precinct.getState().getName();
    }

    private void writeElection(Election election1, Election election2) {
        for (CandidateResult cr1 : election1.getResults()) {
            candidateResultRepository.delete(cr1);
        }

        for (CandidateResult cr2 : election2.getResults()) {
            candidateResultRepository.save(cr2);
            cr2.setElection(election1);
        }
    }

    private void writeDemograpic(Demographic demographic1, Demographic demographic2) {
        demographic1.setAsianPop(demographic2.getAsianPop());
        demographic1.setBlackPop(demographic2.getBlackPop());
        demographic1.setWhitePop(demographic2.getWhitePop());
        demographic1.setHispanicPop(demographic2.getHispanicPop());
        demographic1.setOtherPop(demographic1.getOtherPop());
    }
}
