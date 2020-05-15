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

with open('../California.json') as f:
    california = json.load(f)

map_cname_to_id = {}
sql = "SELECT c_name, id FROM precinct WHERE state_id = 1"
mycursor.execute(sql)
for result in mycursor.fetchall():
    map_cname_to_id[result[0]] = result[1]

overlap = []  # used for not having duplicates
enclosed = []

state_id = 1
print("Adding Errors for California")
for precinct in california['features']:
    if "errors" in precinct["properties"]:
        for error_type in precinct["properties"]["errors"]:
            for error in precinct["properties"]["errors"][error_type]:
                for key, value in error.items():
                    if value["interest points"]:
                        value["interest points"].append(value["interest points"][0])
                    if error_type == 'Overlapping precinct':
                        value["precincts"].sort()
                        err_string = "".join(value["precincts"])
                        if err_string in overlap:
                            continue
                        else:
                            overlap.append("".join(value["precincts"]))
                        sql = "INSERT INTO overlapping_error (fixed, interest_points, type, state_id, precinct1id, precinct2id) VALUES (%s,%s,%s,%s,%s,%s)"
                        val = (False, json.dumps(value["interest points"]), "OVERLAPPING", state_id, map_cname_to_id[value["precincts"][0]], map_cname_to_id[value["precincts"][1]] )
                        mycursor.execute(sql, val)
                    elif error_type == 'Enclosed precinct':
                        value["precincts"].sort()
                        err_string = "".join(value["precincts"])
                        if err_string in enclosed:
                            continue
                        else:
                            enclosed.append("".join(value["precincts"]))
                        sql = "INSERT INTO enclosed_error (fixed, interest_points, type, state_id, container_precinct_id, enclosed_precinct_id) VALUES (%s,%s,%s,%s,%s,%s)"
                        val = (False, json.dumps(value["interest points"]), "ENCLOSED", state_id, map_cname_to_id[value["precincts"][0]], map_cname_to_id[value["precincts"][1]] )
                        mycursor.execute(sql, val)
                    elif error_type == 'Multipolygon':
                        sql = "INSERT INTO multi_polygon_error (fixed, interest_points, type, state_id, precinct_id) VALUES (%s,%s,%s,%s,%s)"
                        val = (False, json.dumps(value["interest points"]), "MULTIPOLYGON", state_id, map_cname_to_id[value["precincts"]])
                        mycursor.execute(sql, val)
                    elif error_type == 'Unclosed precinct':
                        sql = "INSERT INTO unclosed_error (fixed, interest_points, type, state_id, precinct_id) VALUES (%s,%s,%s,%s,%s)"
                        val = (False, json.dumps(value["interest points"]), "UNCLOSED", state_id, map_cname_to_id[value["precincts"]])
                        mycursor.execute(sql, val)
                    elif error_type == 'Anomalous data':
                        sql = "INSERT INTO anomalous_data_error (fixed, interest_points, type, state_id, precinct_id) VALUES (%s,%s,%s,%s,%s)"
                        val = (False, json.dumps(value["interest points"]), "ANOMALOUS_DATA", state_id, map_cname_to_id[value["precincts"]])
                        mycursor.execute(sql, val)
print(len(overlap))
print(len(enclosed))
for map_coverage_error in california['map coverage errors']:
    for key,value in map_coverage_error.items():
        sql = "INSERT INTO map_coverage_error (fixed, interest_points, type, state_id, map_coverage_type) VALUES (%s,%s,%s,%s,%s)"
        val = (False, json.dumps(value["interest points"]), "MAP_COVERAGE", state_id, key)
        mycursor.execute(sql, val)
