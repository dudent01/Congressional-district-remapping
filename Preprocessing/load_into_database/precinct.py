import json
import mysql.connector

mydb = mysql.connector.connect(
    host="mysql3.cs.stonybrook.edu",
    user="befeng",
    passwd="cse416gators",
    database="befeng"
)

mycursor = mydb.cursor()

with open('Utah.json') as f:
    data = json.load(f)

for precinct in data['features']:
    if "presidential" in precinct["properties"]:
        sql = "INSERT INTO election (type) VALUES (%s)"
        val = ("PRESIDENTIAL_2016",)
        mycursor.execute(sql, val)
        pres2016_id = mycursor.lastrowid

        for name, value in precinct["properties"]["presidential"].items():
            sql = "INSERT INTO candidate_result (name, party, votes, election_id) VALUES (%s,%s,%s,%s)"
            val = (name, value["party"].upper(), value["votes"], pres2016_id)
            mycursor.execute(sql, val)
        # mycursor.execute(sql, val)
        del precinct["properties"]["presidential"]
    else:
        pres2016_id = None
    sql = "INSERT INTO precinct (geojson, name, state_id, pres2016_id) VALUES (%s,%s,%s,%s)"
    val = (json.dumps(precinct), precinct['properties']['precinctid'], 2, pres2016_id)
    mycursor.execute(sql, val)

mydb.commit()
