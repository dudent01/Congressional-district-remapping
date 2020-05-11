import json

with open('./national_parks_2.json') as f:
    data = json.load(f)

precincts = {
    "type": "FeatureCollection",
    "features": []
}

for precinct in data["features"]:
    precincts["features"].append({
        "type": "Feature",
        "properties": {},
        "geometry": precinct["geometry"]
    })

with open('simplified_national_parks.json', 'w') as f:
    json.dump(precincts, f)