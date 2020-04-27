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
  sql = "INSERT INTO precinct (geojson, name, state_id) VALUES (%s,%s,%s)"
  val = (json.dumps(precinct), precinct['properties']['precinctid'], 2)
  mycursor.execute(sql, val)

  sql = "INSERT INTO election ("

  mycursor.lastrowid

mydb.commit()
