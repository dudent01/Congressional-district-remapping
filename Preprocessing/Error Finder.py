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
cnames            = [[] for i in repeat(None, numPrecincts)]
boundaries        = [[] for i in repeat(None, numPrecincts)]
errors            = [[] for i in repeat(None, numPrecincts)]

for i in range(numPrecincts):
    if(utah_precincts[i]['geometry'] != None and utah_precincts[i]['geometry']['type'] == "MultiPolygon"):
        mperror = em.errorMaker(3, [], errorID, utah_precincts[i]['properties']['cname'])
        errors[i].append(mperror)
        utah_precincts[i]['properties']['errors'] = errors[i][0]
        errorID += 1

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_data, utah, indent= 2)

'''for i in range(numPrecincts):
    cnames[i] = utah_precincts[i]['properties']['cname']
    ring = LinearRing(utah_precincts[i]['geometry']["coordinates"][0])
    boundaries[i] = ring
    if (utah_precincts[i]['properties']['cname'] != cnames[0]):
        print(boundaries[i])'''