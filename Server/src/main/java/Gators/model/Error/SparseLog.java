package Gators.model.Error;

public interface SparseLog {
    long getId();

    java.util.Date getLogDate();

    String getOldData();

    String getNewData();

    String getChangeType();

    Long getPrecinctId();

    ErrorType getErrorType();
}
