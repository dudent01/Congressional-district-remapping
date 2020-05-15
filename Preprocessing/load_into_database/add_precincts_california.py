import json
import mysql.connector

with open('database.json') as f:
    db_config = json.load(f)

mydb = mysql.connector.connect(
    host=db_config["host"],
    user=db_config["username"],
    passwd=db_config["password"],
    database=db_config["database"]
)
mycursor = mydb.cursor()

with open('../California.json') as f:
    california = json.load(f)

map_cname_to_id = {}
#
# #Adding Election and Precinct Data
# print("Adding Precincts and Election")
# for precinct in california['features']:
#     if "presidential" in precinct["properties"]:
#         sql = "INSERT INTO election (type) VALUES (%s)"
#         val = ("PRESIDENTIAL_2016",)
#         mycursor.execute(sql, val)
#         pres2016_id = mycursor.lastrowid
#
#         vals = []
#         for name, value in precinct["properties"]["presidential"].items():
#             sql = "INSERT INTO candidate_result (name, party, votes, election_id) VALUES (%s,%s,%s,%s)"
#             vals.append((name, value["party"].upper(), value["votes"], pres2016_id))
#         mycursor.executemany(sql, vals)
#         del precinct["properties"]["presidential"]
#     else:
#         pres2016_id = None
#
#     sql = "INSERT INTO demographic (asian_pop, black_pop, hispanic_pop, other_pop, white_pop) VALUES (%s,%s,%s," \
#           "%s,%s) "
#     if "demographics" in precinct["properties"]:
#         val = (0, 0, 0, 0, 0)
#     else:
#         val = (0, 0, 0, 0, 0)
#     mycursor.execute(sql, val)
#     demographic_id = mycursor.lastrowid
#
#     id = precinct['properties']['ID']
#     cname = precinct['properties']['cname']
#     precinct["properties"] = {}
#
#     sql = "INSERT INTO precinct (name, state_id, pres2016_id, demographic_id, c_name, geojson) VALUES (%s,%s,%s,%s,%s,%s)"
#     val = (id, 1, pres2016_id, demographic_id, cname, json.dumps(precinct))
#     mycursor.execute(sql, val)
#     map_cname_to_id[cname] = mycursor.lastrowid

#Adding Neighbors
sql = "SELECT c_name, id FROM precinct WHERE state_id = 1"
mycursor.execute(sql)
for result in mycursor.fetchall():
    map_cname_to_id[result[0]] = result[1]

print("Adding Neighbors")
for precinct in california['features']:
    if "neighbors" in precinct["properties"]:
        for neighbor in precinct["properties"]["neighbors"]:
            sql = "INSERT INTO precinct_neighbors VALUES (%s,%s)"
            val = (map_cname_to_id[precinct["properties"]["cname"]], map_cname_to_id[neighbor])
            try:
                mycursor.execute(sql, val)
            except:
                continue
mydb.commit()
