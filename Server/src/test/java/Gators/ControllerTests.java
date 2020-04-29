package Gators;

import Gators.model.Demographic.Demographic;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Sql("/TestDemographicData.sql")
class ControllerTests {
    private final TestRestTemplate testRestTemplate;

    @Autowired
    public ControllerTests(TestRestTemplate testRestTemplate) {
        this.testRestTemplate = testRestTemplate;
    }

    @Test
    public void testDemographicById() {
        ResponseEntity<Demographic> response = testRestTemplate.getForEntity("/api/precinct/999999/demographic", Demographic.class);
        assertEquals(999999, response.getBody().getId());
        assertEquals(10, response.getBody().getWhitePop());
        assertEquals(200, response.getBody().getBlackPop());
        assertEquals(200, response.getBody().getAsianPop());
        assertEquals(50, response.getBody().getHispanicPop());
        assertEquals(20, response.getBody().getOtherPop());
    }
}