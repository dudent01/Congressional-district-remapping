package Gators.model.Demographic;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Demographic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;

//    @Column
//    private int totalPop;

    @Column
    private int whitePop;

    @Column
    private int blackPop;

    @Column
    private int asianPop;

    @Column
    private int hispanicPop;

    @Column
    private int otherPop;
}
