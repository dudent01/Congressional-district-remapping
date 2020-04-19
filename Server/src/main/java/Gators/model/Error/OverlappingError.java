package Gators.model.Error;

import Gators.model.Precinct;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class OverlappingError extends Error
{
    @ManyToOne
    private Precinct precinct1;

    @ManyToOne
    private Precinct precinct2;

    public Precinct getPrecinct1()
    {
        return precinct1;
    }

    public void setPrecinct1(Precinct precinct1)
    {
        this.precinct1 = precinct1;
    }

    public Precinct getPrecinct2()
    {
        return precinct2;
    }

    public void setPrecinct2(Precinct precinct2)
    {
        this.precinct2 = precinct2;
    }
}
