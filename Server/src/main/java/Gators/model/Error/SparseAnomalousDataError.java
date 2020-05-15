package Gators.model.Error;

public interface SparseAnomalousDataError extends SparseError {
    long getPrecinctId();

    DataCategory getDataCategory();

    String getDataKey();
}
