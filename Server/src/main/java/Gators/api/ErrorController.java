package Gators.api;

import Gators.model.Error.SparseError;
import Gators.service.ErrorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Set;

@RequestMapping("api/error")
@RestController
public class ErrorController {
    private final ErrorService errorService;

    @Autowired
    public ErrorController(ErrorService errorService) {
        this.errorService = errorService;
    }

    @GetMapping(path = "/state/{stateAbbr}")
    public HashMap<String, Set<? extends SparseError>> getErrorsByStateAbbr(@PathVariable String stateAbbr) {
        return errorService.getErrorsByStateAbbr(stateAbbr);
    }
}
