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
coincident = 0.000705           # ~ 200 feet
errorCopy = 0

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "r") as utah:
    utah_data = json.load(utah)
utah_precincts = utah_data['features']

numPrecincts      = len(utah_precincts)
possibleNeighbors = [[] for i in repeat(None, numPrecincts)]
boundaries        = [[] for i in repeat(None, numPrecincts)]
errors            = [[] for i in repeat(None, numPrecincts)]

# Populating cnames and boundaries
for i in range(numPrecincts):
    if(utah_precincts[i]['geometry'] == None):
        continue
    if(utah_precincts[i]['geometry']['type'] != "MultiPolygon"):
        poly = Polygon(utah_precincts[i]['geometry']['coordinates'][0])
        boundaries[i].append(poly)
    else:
        for j in range(len(utah_precincts[i]['geometry']['coordinates'][0])):
            poly = Polygon(utah_precincts[i]['geometry']['coordinates'][0][j])
            boundaries[i].append(poly)

# Populating possibleNeighbors
def neighborSearch(precinct):
    precinctPNeighbors = possibleNeighbors[precinct]            # Can further optimize by saving boundaries[precinct] and boundaries[precinct][0]
    precinctBound = boundaries[precinct]
    if(precinctBound != []):
        firstPrecinctBound = precinctBound[0]
    for candidate in range(precinct + 1, numPrecincts):
        if(precinctBound == []):
            break
        if(boundaries[candidate] != [] and precinctBound != [] and Polygon(firstPrecinctBound).distance(Polygon(boundaries[candidate][0])) <= 0.001):
            precinctPNeighbors.append(candidate)
            possibleNeighbors[candidate].append(precinct)

for i in range(numPrecincts):
    neighborSearch(i)

def errorAdder(precinct, error):
    errors[precinct].append(error)
    utah_precincts[precinct]['properties']['errors'] = errors[precinct]
    global errorID
    errorID += 1

def overlapMaker(region, i, j):
    eroded = region.buffer(-coincident)
    if(eroded.boundary.length == 0.0):
        area_bounds = region.bounds
        points = list([[area_bounds[0], area_bounds[1]], [area_bounds[2], area_bounds[3]],
                       [area_bounds[0], area_bounds[3]], [area_bounds[2], area_bounds[1]]])
        global errorID
        id = errorID
        precincts1 = [utah_precincts[i]['properties']['cname'], utah_precincts[j]['properties']['cname']]
        for error in errors[j]:
            overlappers = error
            if(list(overlappers.keys()) == ['Overlapping precincts']):
                if(overlappers['Overlapping precincts']['precincts'][1] in precincts1 and overlappers['Overlapping precincts']['precincts'][0] in precincts1):
                    id = overlappers['Overlapping precincts']['id']
                    global errorCopy
                    errorCopy = 1                       # If overlap already occured, error has same id
                    break
        overlap = em.errorMaker(0, points, id, precincts1)
        errorAdder(i, overlap)
        if (errorCopy == 1):
            errorID -= 1
        errorCopy = 0

# Identifying overlapping precincts
for i in range(len(boundaries)):
    if (boundaries[i] != []):  # NEED TO FIX remove last empty geometry
        precinct = boundaries[i][0]
        for j in possibleNeighbors[i]:
            other_precinct = boundaries[j][0]
            if (precinct.overlaps(other_precinct) and (precinct.touches(other_precinct) == False)):
                if ((precinct.is_valid == False) or
                    (other_precinct.is_valid == False)):  # NEED TO FIX self-intersecting polygons can't intersect
                    continue
                area = precinct.intersection(other_precinct)
                if area.geom_type == "MultiPolygon":
                    for region in area:
                        overlapMaker(region, i, j)
                else:
                    overlapMaker(area, i, j)

# Identifying enclosed precincts
for i in range(len(boundaries)):
    if(boundaries[i] != []):                    # NEED TO FIX remove last empty geometry
        precinct = boundaries[i][0]
        for j in possibleNeighbors[i]:
            if(precinct.contains(boundaries[j][0])):
                enclosed_bounds = boundaries[j][0].bounds
                points = list([[enclosed_bounds[0], enclosed_bounds[1]], [enclosed_bounds[2], enclosed_bounds[3]],
                               [enclosed_bounds[0], enclosed_bounds[3]], [enclosed_bounds[2], enclosed_bounds[1]]])
                enclosed = em.errorMaker(2, points, errorID, [utah_precincts[i]['properties']['cname'], utah_precincts[j]['properties']['cname']])
                errorAdder(i, enclosed)
            if(precinct.within(boundaries[j][0])):
                enclosed_bounds = precinct.bounds
                points = list([[enclosed_bounds[0], enclosed_bounds[1]], [enclosed_bounds[2], enclosed_bounds[3]],
                               [enclosed_bounds[0], enclosed_bounds[3]], [enclosed_bounds[2], enclosed_bounds[1]]])
                enclosed = em.errorMaker(2, points, errorID, [utah_precincts[j]['properties']['cname'], utah_precincts[i]['properties']['cname']])
                errorAdder(i, enclosed)

# Identifying multipolygon errors
for i in range(numPrecincts):
    if(utah_precincts[i]['geometry'] != None and utah_precincts[i]['geometry']['type'] == "MultiPolygon"):
        mperror = em.errorMaker(3, [], errorID, utah_precincts[i]['properties']['cname'])
        errors[i].append(mperror)
        utah_precincts[i]['properties']['errors'] = errors[i][-1]
        errorID += 1

# Find unclosed precincts ------ seems that there are none
for i in range(numPrecincts):
    if(utah_precincts[i]['geometry'] != None):
        precinct = utah_precincts[i]['geometry']['coordinates'][0] if (utah_precincts[i]['geometry']['type'] != "MultiPolygon") else utah_precincts[i]['geometry']['coordinates'][0][0]
        line = LineString(precinct)
        if(line.coords[0][0] != line.coords[-1][0] or line.coords[0][1] != line.coords[-1][1]):
            ucerror = em.errorMaker(5, [], errorID, utah_precincts[i]['properties']['cname'])
            errorAdder(i, ucerror)


with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_data, utah, indent= 2)

import winsound
winsound.Beep(300, 1000)
winsound.Beep(300, 1000)