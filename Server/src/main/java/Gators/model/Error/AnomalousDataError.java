package Gators.model.Error;

import Gators.model.Precinct;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class AnomalousDataError extends Error
{
    @ManyToOne(fetch =  FetchType.LAZY)
    private Precinct precinct;

    @Enumerated(EnumType.STRING)
    private DataCategory dataCategory;

    @Column
    private String dataKey;
}
