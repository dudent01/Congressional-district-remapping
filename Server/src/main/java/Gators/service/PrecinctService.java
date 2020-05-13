package Gators.service;

import Gators.model.Demographic.Demographic;
import Gators.model.Election.CandidateResult;
import Gators.model.Election.Election;
import Gators.model.Error.Log;
import Gators.model.Precinct;
import Gators.repository.LogRepository;
import Gators.repository.PrecinctRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryCollection;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.io.ParseException;
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

    @Autowired
    public PrecinctService(PrecinctRepository precinctRepository, LogRepository logRepository) {
        this.precinctRepository = precinctRepository;
        this.logRepository = logRepository;
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

    public Collection getPres2016AndDemographicById(long id) {
        return new ArrayList(Arrays.asList(precinctRepository.findById(id).orElse(null).getPres2016(),
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

    @Transactional
    public Precinct mergePrecinctsById(long id1, long id2) {
        Precinct precinct1 = precinctRepository.findById(id1).orElse(null);
        Precinct precinct2 = precinctRepository.findById(id2).orElse(null);

        ObjectMapper mapper = new ObjectMapper();

        Log log = new Log(precinct1, "Merge Precincts");
        try {
            log.setOldData(stringifyPrecinct(precinct2, mapper));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        JsonParser springParser = JsonParserFactory.getJsonParser();
        Map<String, Object> precinct1Map = springParser.parseMap(precinct1.getGeojson());
        Map<String, Object> precinct2Map = springParser.parseMap(precinct2.getGeojson());

        String precinct1Json = null;
        String precinct2Json = null;
        try {
            precinct1Json = mapper.writeValueAsString(precinct1Map.get("geometry"));
            precinct2Json = mapper.writeValueAsString(precinct2Map.get("geometry"));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        Collection<Geometry> geometryList = new LinkedList<>();
        GeoJsonReader geoJsonReader = new GeoJsonReader();
        Geometry g1 = null, g2 = null;
        try {
            g1 = inflate(geoJsonReader.read(precinct1Json));
            g2 = inflate(geoJsonReader.read(precinct2Json));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Collections.addAll(geometryList, g1, g2);
        GeometryFactory geometryFactory = new GeometryFactory();
        Object obj = geometryFactory.buildGeometry(geometryList);
        GeometryCollection geometryCollection = (GeometryCollection) obj;
        Geometry union = geometryCollection.union();  //perform union
        String str = new GeoJsonWriter().write(deflate(union));
        precinct1Map.put("geometry", springParser.parseMap(str));

        String newGeojson = null;
        try {
            newGeojson = new ObjectMapper().writeValueAsString(precinct1Map);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        precinct1.setGeojson(newGeojson);

        mergeDemographics(precinct1.getDemographic(), precinct2.getDemographic());

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

        try {
            log.setNewData(stringifyPrecinct(precinct1, mapper));

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        logRepository.save(log);

        return precinct1;
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
        if (election1 == null) {
            election1 = new Election(election2.getType());
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
                election1.getResults().add(
                        new CandidateResult(cr2.getName(), cr2.getParty(), cr2.getVotes(), cr2.getElection()));
            }
        }
    }

    private void mergeDemographics(Demographic demographic1, Demographic demographic2) {
        if (demographic2 == null) {
            return;
        }
        if (demographic1 == null) {
            demographic1 = new Demographic();
        }
        demographic1.setAsianPop(demographic1.getAsianPop() + demographic2.getAsianPop());
        demographic1.setBlackPop(demographic1.getBlackPop() + demographic2.getBlackPop());
        demographic1.setWhitePop(demographic1.getWhitePop() + demographic2.getWhitePop());
        demographic1.setHispanicPop(demographic1.getHispanicPop() + demographic2.getHispanicPop());
        demographic1.setOtherPop(demographic1.getOtherPop() + demographic2.getOtherPop());
    }

    private String stringifyPrecinct(Precinct precinct, ObjectMapper mapper) throws JsonProcessingException {
        return mapper.writeValueAsString(precinct) + "\nneighbors : " + precinct.getNeighbors().stream().map(
                Precinct::getCName).collect(Collectors.toSet()).toString() + mapper.writeValueAsString(
                precinct.getPres2016()) + mapper.writeValueAsString(
                precinct.getCong2016()) + mapper.writeValueAsString(
                precinct.getCong2018()) + mapper.writeValueAsString(
                precinct.getDemographic()) + "\nstate : " + precinct.getState().getName();
    }
}
