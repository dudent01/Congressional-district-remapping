package Gators.model.Error;

public interface SparseError {
    long getId();

    ErrorType getType();

    boolean isFixed();

    String getInterestPoints();

    long getStateId();
}
