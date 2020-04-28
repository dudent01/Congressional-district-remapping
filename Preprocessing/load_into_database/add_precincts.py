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
        for name, value in precinct["properties"]["presidential"].items():
            sql = "INSERT INTO candidate_result (name, party, votes, election_id) VALUES (%s,%s,%s,%s)"
            val = (name, value["party"].upper(), value["votes"], pres2016_id)
            mycursor.execute(sql, val)
        del precinct["properties"]["presidential"]
    else:
        pres2016_id = None
    sql = "INSERT INTO precinct (name, state_id, pres2016_id, c_name) VALUES (%s,%s,%s,%s)"
    val = (precinct['properties']['precinctid'], 2, pres2016_id, precinct['properties']['cname'])
    mycursor.execute(sql, val)

    precinct_id = mycursor.lastrowid
    precinct["properties"]["id"] = precinct_id  # Add database id into the geojson for use in the frontend
    sql = "UPDATE precinct SET geojson = %s WHERE id = %s"
    val = (json.dumps(precinct), precinct_id)
    mycursor.execute(sql, val)
mydb.commit()
