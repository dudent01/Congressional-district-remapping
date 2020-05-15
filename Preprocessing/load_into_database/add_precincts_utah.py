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

with open('Utah.json') as f:
    utah = json.load(f)

map_cname_to_id = {}

# Adding Election and Precinct Data
print("Adding Precincts and Election")
for precinct in utah['features']:
    if "presidential" in precinct["properties"]:
        sql = "INSERT INTO election (type) VALUES (%s)"
        val = ("PRESIDENTIAL_2016",)
        mycursor.execute(sql, val)
        pres2016_id = mycursor.lastrowid

        vals = []
        for name, value in precinct["properties"]["presidential"].items():
            sql = "INSERT INTO candidate_result (name, party, votes, election_id) VALUES (%s,%s,%s,%s)"
            vals.append((name, value["party"].upper(), value["votes"], pres2016_id))
        mycursor.executemany(sql, vals)
        del precinct["properties"]["presidential"]
    else:
        pres2016_id = None

    sql = "INSERT INTO demographic (asian_pop, black_pop, hispanic_pop, other_pop, white_pop) VALUES (%s,%s,%s," \
          "%s,%s) "
    if "demographics" in precinct["properties"]:
        val = (0, 0, 0, 0, 0)
    else:
        val = (0, 0, 0, 0, 0)
    mycursor.execute(sql, val)
    demographic_id = mycursor.lastrowid

    id = precinct['properties']['precinctId']
    cname = precinct['properties']['cname']
    precinct["properties"] = {}

    sql = "INSERT INTO precinct (name, state_id, pres2016_id, demographic_id, c_name, geojson) VALUES (%s,%s,%s,%s,%s)"
    val = (id, 2, pres2016_id, demographic_id, cname, json.dumps(precinct))
    mycursor.execute(sql, val)
    map_cname_to_id[precinct['properties']['cname']] = mycursor.lastrowid

with open('Utah.json') as f:
    utah = json.load(f)
# Adding Neighbors
print("Adding Neighbors")
for precinct in utah['features']:
    if "neighbors" in precinct["properties"]:
        for neighbor in precinct["properties"]["neighbors"]:
            sql = "INSERT INTO precinct_neighbors VALUES (%s,%s)"
            val = (map_cname_to_id[precinct["properties"]["cname"]], map_cname_to_id[neighbor])
            mycursor.execute(sql, val)
mydb.commit()
