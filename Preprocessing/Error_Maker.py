def errorMaker(errorCategory, interestPoints, id, precincts):
    '''
    :param errorCategory:   Value for the ErrorCategory enum, specifies type of error
    :param interestPoints:  List of points associated with the error (intersections)
    :param id:              ID of the specific error
    :param precincts:       List of other precincts involved in the error. If ENCLOSED, second precinct is enclosed precinct.
    :return:                General JSON error object
    '''
    if(errorCategory == 0):
        errorName = "Overlapping precincts"
    elif(errorCategory == 1):
        errorName = "Map coverage error"
    elif(errorCategory == 2):
        errorName = "Enclosed precinct"
    elif(errorCategory == 3):
        errorName = "Multipolygon"
    elif(errorCategory == 4):
        errorName = "Anomalous data"
    elif(errorCategory == 5):
        errorName = "Unclosed precinct"
    error = {errorName :
                 {"error type"      : errorCategory,
                  "interest points" : interestPoints,
                  "id"              : id,
                  "precincts"       : precincts}}

    return error

def mapCoverageErrorMaker(generalError, ghostArea):
    '''
    :param generalError     Error that is being expanded
    :param ghostArea:       JSON object representing the area that is not in any precinct
    :return:                Additional line for JSON error object
    '''
    generalError["geojson"] = ghostArea

    return generalError

def dataErrorMaker(generalError, category, key):
    '''
    :param generalError     Error that is being expanded
    :param category:        Category of data in which the error occurs
    :param key:             Key identifying where in the category the data occurs
    :return:                Additional lines for JSON error object
    '''
    generalError["data category"] = category
    generalError["data key"] = key

    return generalError