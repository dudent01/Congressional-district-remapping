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
    del state['properties']['ABBR']

    if abbr == "UT":
        precincts_data_source = "Harvard Dataverse"
        elections_data_source = "Utah.gov OpenDataCatalog"
    else:
        precincts_data_source = None
        elections_data_source = None
    vals.append((json.dumps(state), name, abbr, precincts_data_source, elections_data_source))
sql = "INSERT INTO state (geojson, name, abbr, precincts_data_source, elections_data_source) VALUES (%s,%s,%s,%s,%s)"
mycursor.executemany(sql, vals)
mydb.commit()
