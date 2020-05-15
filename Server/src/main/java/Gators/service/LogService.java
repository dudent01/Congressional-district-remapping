package Gators.service;

import Gators.model.Error.Log;
import Gators.model.Error.SparseLog;
import Gators.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {
    private final LogRepository logRepository;

    @Autowired
    public LogService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public List<SparseLog> getLogs() {
        return logRepository.findAllBy();
    }

}
