package Gators;

import Gators.model.State;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class StateControllerTest {
    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void testGetState() {
        ResponseEntity<State> response = testRestTemplate.getForEntity("/api/state/2", State.class);
        assertEquals(2, response.getBody().getId());
        assertEquals("Utah", response.getBody().getName());
        assertEquals("UT", response.getBody().getAbbr());
    }
}