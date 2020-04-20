package Gators.model.Error;

import Gators.model.Precinct;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
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

    @ManyToOne(fetch = FetchType.LAZY)
    private Precinct precinct;

    @Enumerated(EnumType.STRING)
    private ErrorType type;
}
