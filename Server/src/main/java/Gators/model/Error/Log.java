package Gators.model.Error;

import Gators.model.Precinct;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date logDate;

    @Column(columnDefinition = "TEXT")
    private String oldData;

    @Column(columnDefinition = "TEXT")
    private String newData;

    @Column(columnDefinition = "TEXT")
    private String changeType;

    @ManyToOne(fetch = FetchType.LAZY)
    private Precinct precinct;

    @Enumerated(EnumType.STRING)
    private ErrorType errorType;

    public Log(Precinct precinct, String changeType) {
        logDate = new Date();
        this.precinct = precinct;
        this.changeType = changeType;
    }
}
