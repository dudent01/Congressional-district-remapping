import json
from itertools import repeat
from shapely.geometry import Polygon
from shapely.ops import unary_union

with open('C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah_Voting_Precincts_Shape_File_10.json') as f:
    utah_precincts = json.load(f)

f.close()

for precinct in utah_precincts['features']:
    del precinct['properties']['shape_area']
    del precinct['properties']['versionnbr']
    del precinct['properties']['shape_leng']
    del precinct['properties']['effectived']
    del precinct['properties']['rcvddate']
    del precinct['properties']['subprecinc']
    del precinct['properties']['comments']
    del precinct['properties']['aliasname']

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_precincts, utah, indent= 2)

utah.close()
# Utah.json file has been created, clean of unnecessary information
vote_file = open("C:/Users/Denis/Software Engineering/Data/Utah/Voting/utah_voting_data.json")
voting_data = json.load(vote_file)
vote_file.close()

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "r") as utah:
    utah_precincts = json.load(utah)

numCounties = 29
precinctsByCounty  = [[] for i in repeat(None, numCounties)]
counties           = {'counties' : {}}

# cname added by combined county id and precinct id for unique identifier
for precinct in utah_precincts['features']:
    new_id = "UT_" + precinct['properties']['countyid'] + "_" + precinct['properties']['precinctid'] + "_" + precinct['properties']['vistaid']
    cname = {'cname': new_id}
    precinct['properties'].update(cname)

for precinct in utah_precincts['features']:
    if (precinct['geometry'] == None):
        continue
    if (precinct['geometry']['type'] != "MultiPolygon"):
        poly = Polygon(precinct['geometry']['coordinates'][0])
        precinctsByCounty[int(precinct['properties']['countyid']) - 1].append(poly)
    else:
        for j in range(len(precinct['geometry']['coordinates'][0])):
            poly = Polygon(precinct['geometry']['coordinates'][0][j])
            precinctsByCounty[int(precinct['properties']['countyid']) - 1].append(poly)

for county in precinctsByCounty:
    counties['counties']["County ID " + str(precinctsByCounty.index(county) + 1)] = \
        {"county boundary" : list(unary_union(county).exterior.coords),
                    "votes": {"presidential":
                           {"Trump"     : {"party" : "republican", "votes": 0, "percentage": 0},
                            "Clinton"   : {"party" : "democratic", "votes": 0, "percentage": 0},
                            "Johnson"   : {"party" : "libertarian", "votes": 0, "percentage": 0},
                            "Stein"     : {"party" : "green", "votes": 0, "percentage": 0}}}}

def updateCountyVotes(trump, clinton, johnson, stein, county):
    presidential = county['votes']['presidential']
    presidential['Trump']['votes'] += trump
    presidential['Clinton']['votes'] += clinton
    presidential['Johnson']['votes'] += johnson
    presidential['Stein']['votes'] += stein

def updateCountyPercent(county):
    presidential = counties['counties']["County ID " + str(precinctsByCounty.index(county) + 1)]['votes']['presidential']
    trump = presidential['Trump']['votes']
    clinton = presidential['Clinton']['votes']
    johnson = presidential['Johnson']['votes']
    stein = presidential['Stein']['votes']
    total = trump + clinton + johnson + stein
    if (total != 0):
        trump1 = trump * 100 / total
        presidential['Trump']['percentage'] = round(trump1, 2)
        clinton1 = clinton * 100 / total
        presidential['Clinton']['percentage'] = round(clinton1, 2)
        johnson1 = johnson * 100 / total
        presidential['Johnson']['percentage'] = round(johnson1, 2)
        stein1 = stein * 100 / total
        presidential['Stein']['percentage'] = round(stein1, 2)

for precinct in utah_precincts['features']:
    for votes in voting_data['features']:
        if(precinct['properties']['precinctid'] == votes['properties']['PrecinctID']):
            trump = votes['properties']['G16PRERTRU']
            clinton = votes['properties']['G16PREDCLI']
            johnson = votes['properties']['G16PRELJOH']
            stein = votes['properties']['G16PREISTE']
            total = trump + clinton + johnson + stein
            if(total != 0):
                trump1 = trump * 100/total
                trump1 = round(trump1, 2)
                clinton1 = clinton * 100/total
                clinton1 = round(clinton1, 2)
                johnson1 = johnson * 100/total
                johnson1 = round(johnson1, 2)
                stein1 = stein * 100/total
                stein1 = round(stein1, 2)
            presidential = {"presidential":
                           {"Trump"     : {"party" : "republican", "votes": trump, "percentage": trump1},
                            "Clinton"   : {"party" : "democratic", "votes": clinton, "percentage": clinton1},
                            "Johnson"   : {"party" : "libertarian", "votes": johnson, "percentage": johnson1},
                            "Stein"     : {"party" : "green", "votes": stein, "percentage": stein1}}}
            precinct['properties'].update(presidential)
            updateCountyVotes(trump, clinton, johnson, stein, counties['counties']["County ID " + str(precinct['properties']['countyid'])])

            errors = {"errors" : {}}
            precinct['properties'].update(errors)

for county in precinctsByCounty:
    updateCountyPercent(county)

utah_precincts.update(counties)

sources = {"sources" : {"precincts"  : "Utah.gov OpenDataCatalog",
                        "voting"     : "Harvard Dataverse"}}
utah_precincts.update(sources)

utah.close()

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_precincts, utah, indent= 2)

utah.close()

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "r") as utah:
    utah_data = json.load(utah)
utah_precincts = utah_data['features']

i = 0
length = len(utah_precincts)
while(i < length):
    if(utah_precincts[i]['geometry'] == None):
        utah_precincts.pop(i)
        length -= 1
    i += 1

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_data, utah, indent=2)