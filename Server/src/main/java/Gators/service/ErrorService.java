package Gators.service;

import Gators.model.Error.*;
import Gators.model.State;
import Gators.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Set;

@Service
public class ErrorService {
    private final AnomalousDataErrorRepository anomalousDataErrorRepository;
    private final EnclosedErrorRepository enclosedErrorRepository;
    private final MapCoverageErrorRepository mapCoverageErrorRepository;
    private final MultiPolygonErrorRepository multiPolygonErrorRepository;
    private final OverlappingErrorRepository overlappingErrorRepository;
    private final UnclosedErrorRepository unclosedErrorRepository;
    private final StateRepository stateRepository;
    private final LogRepository logRepository;
    private final ObjectMapper mapper;

    @Autowired
    public ErrorService(AnomalousDataErrorRepository anomalousDataErrorRepository, EnclosedErrorRepository enclosedErrorRepository,
                        MapCoverageErrorRepository mapCoverageErrorRepository, MultiPolygonErrorRepository multiPolygonErrorRepository,
                        OverlappingErrorRepository overlappingErrorRepository, UnclosedErrorRepository unclosedErrorRepository, StateRepository stateRepository,
                        LogRepository logRepository) {
        this.anomalousDataErrorRepository = anomalousDataErrorRepository;
        this.enclosedErrorRepository = enclosedErrorRepository;
        this.mapCoverageErrorRepository = mapCoverageErrorRepository;
        this.multiPolygonErrorRepository = multiPolygonErrorRepository;
        this.overlappingErrorRepository = overlappingErrorRepository;
        this.unclosedErrorRepository = unclosedErrorRepository;
        this.stateRepository = stateRepository;
        this.logRepository = logRepository;
        mapper = new ObjectMapper();
    }

    public HashMap<String, Set<? extends SparseError>> getErrorsByStateAbbr(String stateAbbr) {
        State state = stateRepository.findByAbbr(stateAbbr);
        HashMap<String, Set<? extends SparseError>> errors = new HashMap<>();
        errors.put("Anomalous Data Errors", anomalousDataErrorRepository.findByStateAndFixed(state, false));
        errors.put("Enclosed Errors", enclosedErrorRepository.findByStateAndFixed(state, false));
        errors.put("Map Coverage Errors", mapCoverageErrorRepository.findByStateAndFixed(state, false));
        errors.put("Multi Polygon Errors", multiPolygonErrorRepository.findByStateAndFixed(state, false));
        errors.put("Overlapping Errors", overlappingErrorRepository.findByStateAndFixed(state, false));
        errors.put("Unclosed Errors", unclosedErrorRepository.findByStateAndFixed(state, false));
        return errors;
    }

    @SneakyThrows
    @Transactional
    public void setFixed(long id, ErrorType errorType) {
        Log log = new Log(errorType, "Fixed Error");
        logRepository.save(log);
        switch (errorType) {
        case ANOMALOUS_DATA:
            AnomalousDataError anomalousDataError = anomalousDataErrorRepository.getOne(id);
            log.setOldData(mapper.writeValueAsString(anomalousDataError));
            anomalousDataError.setFixed(true);
            log.setNewData(mapper.writeValueAsString(anomalousDataError));
            break;
        case ENCLOSED:
            EnclosedError enclosedError = enclosedErrorRepository.getOne(id);
            log.setOldData(mapper.writeValueAsString(enclosedError));
            enclosedError.setFixed(true);
            log.setNewData(mapper.writeValueAsString(enclosedError));
            break;
        case MAP_COVERAGE:
            MapCoverageError mapCoverageError = mapCoverageErrorRepository.getOne(id);
            log.setOldData(mapper.writeValueAsString(mapCoverageError));
            mapCoverageError.setFixed(true);
            log.setNewData(mapper.writeValueAsString(mapCoverageError));
            break;
        case MULTIPOLYGON:
            MultiPolygonError multiPolygonError = multiPolygonErrorRepository.getOne(id);
            log.setOldData(mapper.writeValueAsString(multiPolygonError));
            multiPolygonError.setFixed(true);
            log.setNewData(mapper.writeValueAsString(multiPolygonError));
            break;
        case OVERLAPPING:
            OverlappingError overlappingError = overlappingErrorRepository.getOne(id);
            log.setOldData(mapper.writeValueAsString(overlappingError));
            overlappingError.setFixed(true);
            log.setNewData(mapper.writeValueAsString(overlappingError));
            break;
        case UNCLOSED:
            UnclosedError unclosedError = unclosedErrorRepository.getOne(id);
            log.setOldData(mapper.writeValueAsString(unclosedError));
            unclosedError.setFixed(true);
            log.setNewData(mapper.writeValueAsString(unclosedError));
            break;
        }
    }
}
