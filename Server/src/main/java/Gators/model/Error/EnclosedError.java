package Gators.model.Error;

import Gators.model.Precinct;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
public class EnclosedError extends Error
{
    @ManyToOne
    private Precinct enclosedPrecinct;

    @ManyToOne
    private Precinct containerPrecinct;
}
