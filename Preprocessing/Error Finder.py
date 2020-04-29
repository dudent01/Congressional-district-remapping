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
        ring = LinearRing(utah_precincts[i]['geometry']['coordinates'][0])
        boundaries[i].append(ring)
    else:
        for j in range(len(utah_precincts[i]['geometry']['coordinates'][0])):
            ring = LinearRing(utah_precincts[i]['geometry']['coordinates'][0][j])
            boundaries[i].append(ring)

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
    radius = 0
    for candidate in range(numPrecincts):
        if(cnames[candidate] != cnames[precinct]):
            if(boundaries[candidate] != [] and boundaries[precinct] != [] and boundaries[precinct][0].distance(boundaries[candidate][0]) <= 0.001):
                possibleNeighbors[precinct].append(candidate)

''' Next block commented '''
for i in range(numPrecincts):
    print(str(100 * i / numPrecincts) + "% done with a")
    neighborSearch(i)

for i in range(len(boundaries)):
    print(str(100 * i / numPrecincts) + "% done with b")
    for j in possibleNeighbors[i]:
        if(boundaries[i][0].crosses(boundaries[j][0])):
            overlap = em.errorMaker(0, [], errorID, [utah_precincts[i]['properties']['cname'], utah_precincts[j]['properties']['cname']])
            errors[i].append(overlap)
            utah_precincts[i]['properties']['errors'] = errors[i][-1]
            errorID += 1

# Identifying multipolygon errors
for i in range(numPrecincts):
    if(utah_precincts[i]['geometry'] != None and utah_precincts[i]['geometry']['type'] == "MultiPolygon"):
        mperror = em.errorMaker(3, [], errorID, utah_precincts[i]['properties']['cname'])
        errors[i].append(mperror)
        utah_precincts[i]['properties']['errors'] = errors[i][-1]
        errorID += 1

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_data, utah, indent= 2)