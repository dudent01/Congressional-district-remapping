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

with open('../West_Virginia.json') as f:
    wv = json.load(f)

for precinct in wv['features']:
    sql = "INSERT INTO demographic (asian_pop, black_pop, hispanic_pop, other_pop, white_pop) VALUES (%s,%s,%s," \
          "%s,%s)"
    val = (0, 0, 0, 0, 0)
    mycursor.execute(sql, val)
    demographic_id = mycursor.lastrowid

    id = precinct['properties']['GEOID10']
    cname = precinct['properties']['cname']

    sql = "INSERT INTO precinct (name, state_id, demographic_id, c_name, geojson) VALUES (%s,%s,%s,%s,%s)"
    val = (id, 3, demographic_id, cname, json.dumps(precinct))
    mycursor.execute(sql, val)