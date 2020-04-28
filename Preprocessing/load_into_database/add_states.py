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

with open('States.json') as f:
    data = json.load(f)

vals = []
for state in data['features']:
    name = state['properties']['NAME']
    abbr = state['properties']['ABBR']
    vals += (json.dumps(state), name, abbr)
sql = "INSERT INTO state (geojson, name, abbr) VALUES (%s,%s,%s)"
mycursor.executemany(sql, vals)
mydb.commit()
