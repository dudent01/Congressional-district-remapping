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
    sql = "INSERT INTO precinct (name, state_id, pres2016_id, c_name, geojson) VALUES (%s,%s,%s,%s,%s)"
    val = (precinct['properties']['precinctid'], 2, pres2016_id, None, json.dumps(precinct))
    mycursor.execute(sql, val)
mydb.commit()
