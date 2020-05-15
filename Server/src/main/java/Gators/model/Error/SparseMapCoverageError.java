package Gators.model.Error;

public interface SparseMapCoverageError extends SparseError {
    String getGeojson();

    String getMapCoverageType();
}
