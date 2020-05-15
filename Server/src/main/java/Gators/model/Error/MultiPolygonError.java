package Gators.model.Error;

import Gators.model.Precinct;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MultiPolygonError extends Error {
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY)
    private long precinctId;
}
