package Gators.service;

import Gators.model.Error.SparseError;
import Gators.model.State;
import Gators.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        errors.put("Anomalous Data Errors", anomalousDataErrorRepository.findByState(state));
        errors.put("Enclosed Errors", enclosedErrorRepository.findByState(state));
        errors.put("Map Coverage Errors", mapCoverageErrorRepository.findByState(state));
        errors.put("Multi Polygon Errors", multiPolygonErrorRepository.findByState(state));
        errors.put("Overlapping Errors", overlappingErrorRepository.findByState(state));
        errors.put("Unclosed Errors", unclosedErrorRepository.findByState(state));
        return errors;
    }
}
