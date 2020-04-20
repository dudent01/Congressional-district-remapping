import json
import mysql.connector

mydb = mysql.connector.connect(
  host="mysql3.cs.stonybrook.edu",
  user="befeng",
  passwd="cse416gators",
  database="befeng"
)

mycursor = mydb.cursor()

with open('utah_precincts.json') as f:
  data = json.load(f)

for state in data['features']:
  sql = "INSERT INTO precinct (geojson, name, state_id) VALUES (%s,%s,%s)"
  val = (json.dumps(state), state['properties']['precinctid'], 2)
  mycursor.execute(sql, val)

mydb.commit()