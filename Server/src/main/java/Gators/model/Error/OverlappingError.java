package Gators.model.Error;

import Gators.model.Precinct;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
public class OverlappingError extends Error
{
    @ManyToOne(fetch =  FetchType.LAZY)
    private Precinct precinct1;

    @ManyToOne(fetch =  FetchType.LAZY)
    private Precinct precinct2;
}
