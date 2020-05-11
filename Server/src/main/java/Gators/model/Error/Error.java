package Gators.model.Error;

import Gators.model.State;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

//@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@MappedSuperclass
public abstract class Error {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;

    @Enumerated(EnumType.STRING)
    private ErrorType type;

    @Column
    private boolean fixed;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String interestPoints;

    @ManyToOne(fetch = FetchType.LAZY)
    private State state;
}
