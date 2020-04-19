package Gators.model.Error;

import Gators.model.Precinct;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class MultiPolygonError extends Error
{
    @ManyToOne
    private Precinct precinct;

    public Precinct getPrecinct()
    {
        return precinct;
    }

    public void setPrecinct(Precinct precinct)
    {
        this.precinct = precinct;
    }
}
