import json

with open('C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah_Voting_Precincts_Shape_File_10.json') as f:
    utah_precincts = json.load(f)

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

# Utah.json file has been created, clean of unnecessary information
vote_file = open("C:/Users/Denis/Software Engineering/Data/Utah/Voting/utah_voting_data.json")
voting_data = json.load(vote_file)
vote_file.close()

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "r") as utah:
    utah_precincts = json.load(utah)

# cname added by combined county id and precinct id for unique identifier
for precinct in utah_precincts['features']:
    new_id = "UT_" + precinct['properties']['countyid'] + "_" + precinct['properties']['precinctid']
    cname = {'cname':new_id}
    precinct['properties'].update(cname)

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

with open("C:/Users/Denis/Software Engineering/Data/Utah/Precincts/Utah.json", "w") as utah:
    json.dump(utah_precincts, utah, indent= 2)

