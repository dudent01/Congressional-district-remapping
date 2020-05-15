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

with open('../Utah.json') as f:
    utah = json.load(f)

map_cname_to_id = {}
sql = "SELECT c_name, id FROM precinct WHERE state_id = 2"
mycursor.execute(sql)
for result in mycursor.fetchall():
    map_cname_to_id[result[0]] = result[1]

overlap = []  # used for not having duplicates
enclosed = []

state_id = 2
print("Adding Errors for Utah")
for precinct in utah['features']:
    if "errors" in precinct["properties"]:
        for error_type in precinct["properties"]["errors"]:
            for error in precinct["properties"]["errors"][error_type]:
                for key, value in error.items():
                    if error_type == 'Overlapping precinct':
                        value["precincts"].sort()
                        err_string = "".join(value["precincts"])
                        if err_string in overlap:
                            continue
                        else:
                            overlap.append("".join(value["precincts"]))
                        sql = "INSERT INTO overlapping_error (fixed, interest_points, type, state_id, container_precinct_id, enclosed_precinct_id) VALUES (%s,%s,%s,%s,%s,%s,)"
                        val = (False, value["interest points"], "OVERLAPPING", state_id, map_cname_to_id[value["precincts"][0]], map_cname_to_id[value["precincts"][1]] )
                        mycursor.execute(sql)
                    elif error_type == 'Enclosed precinct':
                        value["precincts"].sort()
                        err_string = "".join(value["precincts"])
                        if err_string in enclosed:
                            continue
                        else:
                            enclosed.append("".join(value["precincts"]))
                        sql = "INSERT INTO enclosed_error (fixed, interest_points, type, state_id, precinct1_id, precinct2_id) VALUES (%s,%s,%s,%s,%s,%s,)"
                        val = (False, value["interest points"], "ENCLOSED", state_id, map_cname_to_id[value["precincts"][0]], map_cname_to_id[value["precincts"][1]] )
                        mycursor.execute(sql)
                    elif error_type == 'Multipolygon':
                        sql = "INSERT INTO multi_polygon_error (fixed, interest_points, type, state_id, precinct_id) VALUES (%s,%s,%s,%s,%s,%s,)"
                        val = (False, value["interest points"], "MULTIPOLYGON", state_id, map_cname_to_id[value["precincts"]])
                        mycursor.execute(sql)
                    elif error_type == 'Unclosed precinct':
                        sql = "INSERT INTO unclosed_error (fixed, interest_points, type, state_id, precinct_id) VALUES (%s,%s,%s,%s,%s,%s,)"
                        val = (False, value["interest points"], "UNCLOSED", state_id, map_cname_to_id[value["precincts"]])
                        mycursor.execute(sql)
                    elif error_type == 'Anomalous data':
                        continue
print(len(overlap))
print(len(enclosed))
