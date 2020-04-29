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
    error = {errorName :
                 {"error type"      : errorCategory,
                  "interest points" : interestPoints,
                  "id"              : id,
                  "precincts"       : precincts}}

    return error

def mapCoverageErrorMaker(ghostArea):
    '''
    :param ghostArea:       JSON object representing the area that is not in any precinct
    :return:                Additional line for JSON error object
    '''
    error = {"geojson" : ghostArea}

    return error

def dataErrorMaker(category, key):
    '''
    :param category:        Category of data in which the error occurs
    :param key:             Key identifying where in the category the data occurs
    :return:                Additional lines for JSON error object
    '''
    error = {"data category" : category,
             "data key" : key}

    return error