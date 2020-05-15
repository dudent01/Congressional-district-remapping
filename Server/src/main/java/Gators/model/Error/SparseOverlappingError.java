package Gators.model.Error;

public interface SparseOverlappingError extends SparseError {
    long getPrecinct1Id();

    long getPrecinct2Id();
}
