package Gators.model.Error;

public interface SparseEnclosedError extends SparseError {
    long getEnclosedPrecinctId();

    long getContainerPrecinctId();
}
