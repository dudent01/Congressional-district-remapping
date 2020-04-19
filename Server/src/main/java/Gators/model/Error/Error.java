package Gators.model.Error;

import Gators.model.State;

import javax.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Error
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Enumerated(EnumType.STRING)
    private ErrorType type;

    @Column
    private boolean fixed;

    @Column
    private String interestPoints;

    @ManyToOne
    private State state;

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public ErrorType getType()
    {
        return type;
    }

    public void setType(ErrorType type)
    {
        this.type = type;
    }

    public boolean isFixed()
    {
        return fixed;
    }

    public void setFixed(boolean fixed)
    {
        this.fixed = fixed;
    }

    public String getInterestPoints()
    {
        return interestPoints;
    }

    public void setInterestPoints(String interestPoints)
    {
        this.interestPoints = interestPoints;
    }

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
    }
}
