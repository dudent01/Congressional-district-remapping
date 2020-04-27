import json
import mysql.connector

mydb = mysql.connector.connect(
  host="mysql3.cs.stonybrook.edu",
  user="befeng",
  passwd="cse416gators",
  database="befeng"
)

mycursor = mydb.cursor()

with open('DummyData.json') as f:
  data = json.load(f)

for state in data['features']:
  name = state['properties']['NAME']
  if name == 'California':
    abbr = 'CA'
  elif name == 'Utah':
    abbr = 'UT'
  else:
    abbr = 'WV'
  sql = "INSERT INTO state (geojson, name, abbr) VALUES (%s,%s,%s)"
  val = (json.dumps(state), name, abbr)
  mycursor.execute(sql, val)

mydb.commit()