package Gators.model.Error;

import Gators.model.Precinct;

import javax.persistence.*;

@Entity
public class AnomalousDataError extends Error
{
    @ManyToOne
    private Precinct precinct;

    @Enumerated(EnumType.STRING)
    private DataCategory dataCategory;

    @Column
    private String dataKey;

    public Precinct getPrecinct()
    {
        return precinct;
    }

    public void setPrecinct(Precinct precinct)
    {
        this.precinct = precinct;
    }

    public DataCategory getDataCategory()
    {
        return dataCategory;
    }

    public void setDataCategory(DataCategory dataCategory)
    {
        this.dataCategory = dataCategory;
    }

    public String getDataKey()
    {
        return dataKey;
    }

    public void setDataKey(String dataKey)
    {
        this.dataKey = dataKey;
    }
}
