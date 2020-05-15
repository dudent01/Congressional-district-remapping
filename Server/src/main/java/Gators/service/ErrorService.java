package Gators.service;

import Gators.model.Error.ErrorType;
import Gators.model.Error.SparseError;
import Gators.model.State;
import Gators.repository.*;
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

    @Autowired
    public ErrorService(AnomalousDataErrorRepository anomalousDataErrorRepository, EnclosedErrorRepository enclosedErrorRepository,
                        MapCoverageErrorRepository mapCoverageErrorRepository, MultiPolygonErrorRepository multiPolygonErrorRepository,
                        OverlappingErrorRepository overlappingErrorRepository, UnclosedErrorRepository unclosedErrorRepository, StateRepository stateRepository) {
        this.anomalousDataErrorRepository = anomalousDataErrorRepository;
        this.enclosedErrorRepository = enclosedErrorRepository;
        this.mapCoverageErrorRepository = mapCoverageErrorRepository;
        this.multiPolygonErrorRepository = multiPolygonErrorRepository;
        this.overlappingErrorRepository = overlappingErrorRepository;
        this.unclosedErrorRepository = unclosedErrorRepository;
        this.stateRepository = stateRepository;
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

    @Transactional
    public void setFixed(long id, ErrorType errorType) {
        switch (errorType) {
        case ANOMALOUS_DATA:
            anomalousDataErrorRepository.getOne(id).setFixed(true);
            break;
        case ENCLOSED:
            enclosedErrorRepository.getOne(id).setFixed(true);
            break;
        case MAP_COVERAGE:
            mapCoverageErrorRepository.getOne(id).setFixed(true);
            break;
        case MULTIPOLYGON:
            multiPolygonErrorRepository.getOne(id).setFixed(true);
            break;
        case OVERLAPPING:
            overlappingErrorRepository.getOne(id).setFixed(true);
            break;
        case UNCLOSED:
            unclosedErrorRepository.getOne(id).setFixed(true);
            break;
        }
    }
}
