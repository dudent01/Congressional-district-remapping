package Gators.model.Error;

import Gators.model.Precinct;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class EnclosedError extends Error
{
    @ManyToOne
    private Precinct enclosedPrecinct;

    @ManyToOne
    private Precinct containerPrecinct;

    public Precinct getEnclosedPrecinct()
    {
        return enclosedPrecinct;
    }

    public void setEnclosedPrecinct(Precinct enclosedPrecinct)
    {
        this.enclosedPrecinct = enclosedPrecinct;
    }

    public Precinct getContainerPrecinct()
    {
        return containerPrecinct;
    }

    public void setContainerPrecinct(Precinct containerPrecinct)
    {
        this.containerPrecinct = containerPrecinct;
    }
}
