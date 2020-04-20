package Gators.model.Error;

import Gators.model.State;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
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

    @ManyToOne(fetch = FetchType.LAZY)
    private State state;
}
