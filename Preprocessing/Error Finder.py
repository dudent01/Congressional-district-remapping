from itertools import repeat
import json
import shapely
from shapely.geometry import LineString
from shapely.geometry.polygon import LinearRing
from shapely.geometry import Polygon
from shapely.validation import explain_validity
from shapely.ops import unary_union
from shapely.ops import shared_paths

import Error_Maker as em

errorID = 0

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "r") as utah:
    utah_data = json.load(utah)
utah_precincts = utah_data['features']

numPrecincts      = len(utah_precincts)
possibleNeighbors = [[] for i in repeat(None, numPrecincts)]
recommendsRadius  = [[] for i in repeat(None, numPrecincts)]
cnames            = [[] for i in repeat(None, numPrecincts)]
boundaries        = [[] for i in repeat(None, numPrecincts)]
errors            = [[] for i in repeat(None, numPrecincts)]

# Populating cnames and boundaries
for i in range(numPrecincts):
    cnames[i] = utah_precincts[i]['properties']['cname']
    if(utah_precincts[i]['geometry'] == None):
        continue
    if(utah_precincts[i]['geometry']['type'] != "MultiPolygon"):
        poly = Polygon(utah_precincts[i]['geometry']['coordinates'][0])
        boundaries[i].append(poly)
    else:
        for j in range(len(utah_precincts[i]['geometry']['coordinates'][0])):
            poly = Polygon(utah_precincts[i]['geometry']['coordinates'][0][j])
            boundaries[i].append(poly)

# Populating possibleNeighbors and recommendedRadius
'''def neighborSearch(precinct, recommended):
    radius = 0
    for candidate in recommended:
        if(cnames[candidate] != cnames[precinct]):
            if(boundaries[candidate] != [] and boundaries[precinct][0].distance(boundaries[candidate][0]) <= 0.001):
                possibleNeighbors[precinct].append(candidate)
                if ((boundaries[precinct][0].length / 2 + 0.003) > radius):
                    radius = boundaries[precinct][0].length / 2 + 0.001
    for candidate in recommended:
        if(boundaries[candidate] != [] and (boundaries[precinct][0].distance(boundaries[candidate][0]) <= radius)):
            recommendsRadius[precinct].append(candidate)

searched = 1
def searchAllNeighbors(precinct, recommended):
    neighborSearch(precinct, recommended)
    for n in possibleNeighbors[precinct]:
        global searched
        searched += 1
        print(str(searched/numPrecincts * 100) + " % completed")
        searchAllNeighbors(n, recommendsRadius[precinct])
        if(searched == numPrecincts):
            return

initial_recommend = list(range(numPrecincts))
searchAllNeighbors(0, initial_recommend)'''
def neighborSearch(precinct):
    precinctCname = cnames[precinct]
    precinctPNeighbors = possibleNeighbors[precinct]
    for candidate in range(numPrecincts):
        if(cnames[candidate] != precinctCname):
            if(boundaries[candidate] != [] and boundaries[precinct] != [] and boundaries[precinct][0].distance(boundaries[candidate][0]) <= 0.001):
                precinctPNeighbors.append(candidate)

''' Next block commented '''
for i in range(numPrecincts):
    neighborSearch(i)

def errorAdder(precinct, error):
    errors[precinct].append(error)
    utah_precincts[precinct]['properties']['errors'] = errors[precinct]
    global errorID
    errorID += 1

for i in range(len(boundaries)):
    if(boundaries[i] != []):
        precinct = boundaries[i][0]
        for j in possibleNeighbors[i]:
            if(precinct.overlaps(boundaries[j][0]) and (precinct.touches(boundaries[j][0]) == False)):
                overlap = em.errorMaker(0, [], errorID, [utah_precincts[i]['properties']['cname'], utah_precincts[j]['properties']['cname']])
                errorAdder(i, overlap)
            if(precinct.contains(boundaries[j][0])):
                enclosed = em.errorMaker(2, [], errorID, [utah_precincts[i]['properties']['cname'], utah_precincts[j]['properties']['cname']])
                errorAdder(i, enclosed)
            elif(precinct.within(boundaries[j][0])):
                enclosed = em.errorMaker(2, [], errorID, [utah_precincts[j]['properties']['cname'], utah_precincts[i]['properties']['cname']])
                errorAdder(i, enclosed)

# Identifying multipolygon errors
for i in range(numPrecincts):
    if(utah_precincts[i]['geometry'] != None and utah_precincts[i]['geometry']['type'] == "MultiPolygon"):
        mperror = em.errorMaker(3, [], errorID, utah_precincts[i]['properties']['cname'])
        errors[i].append(mperror)
        utah_precincts[i]['properties']['errors'] = errors[i][-1]
        errorID += 1

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_data, utah, indent= 2)