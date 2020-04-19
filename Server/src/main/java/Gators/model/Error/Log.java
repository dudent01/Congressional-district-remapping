package Gators.model.Error;

import Gators.model.Precinct;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Log
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date utilDate;

    @Column
    private String prev;

    @Column
    private String newString;

    @ManyToOne
    private Precinct precinct;

    @Enumerated(EnumType.STRING)
    private ErrorType type;

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public Date getUtilDate()
    {
        return utilDate;
    }

    public void setUtilDate(Date utilDate)
    {
        this.utilDate = utilDate;
    }

    public String getPrev()
    {
        return prev;
    }

    public void setPrev(String prev)
    {
        this.prev = prev;
    }

    public String getNewString()
    {
        return newString;
    }

    public void setNewString(String newString)
    {
        this.newString = newString;
    }

    public Precinct getPrecinct()
    {
        return precinct;
    }

    public void setPrecinct(Precinct precinct)
    {
        this.precinct = precinct;
    }

    public ErrorType getType()
    {
        return type;
    }

    public void setType(ErrorType type)
    {
        this.type = type;
    }
}
