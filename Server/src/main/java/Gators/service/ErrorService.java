package Gators.service;

import Gators.model.Error.SparseError;
import Gators.model.State;
import Gators.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

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

    public ArrayList<SparseError> getErrorsByStateAbbr(String stateAbbr) {
        State state = stateRepository.findByAbbr(stateAbbr);
        ArrayList<SparseError> errors = new ArrayList<>();
        errors.addAll(anomalousDataErrorRepository.findByState(state));
        errors.addAll(enclosedErrorRepository.findByState(state));
        errors.addAll(mapCoverageErrorRepository.findByState(state));
        errors.addAll(multiPolygonErrorRepository.findByState(state));
        errors.addAll(overlappingErrorRepository.findByState(state));
        errors.addAll(unclosedErrorRepository.findByState(state));
        return errors;
    }
}
