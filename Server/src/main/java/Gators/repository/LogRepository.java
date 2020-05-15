package Gators.repository;

import Gators.model.Error.Log;
import Gators.model.Error.SparseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    List<SparseLog> findAllBy();
}
