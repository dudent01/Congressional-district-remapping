package Gators.model.Error;

import Gators.model.Precinct;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
public class OverlappingError extends Error
{
    @ManyToOne
    private Precinct precinct1;

    @ManyToOne
    private Precinct precinct2;
}
