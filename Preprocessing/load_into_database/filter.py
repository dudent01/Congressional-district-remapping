import json

with open('../Utah.json') as f:
    data = json.load(f)

enclosed_precincts = {
    "type": "FeatureCollection",
    "features": []
}

for precinct in data["features"]:
    # if "errors" in precinct["properties"] and precinct["properties"]["errors"]:
    if precinct["properties"]["cname"] == "UT_20_NS_NS:U":
        enclosed_precincts["features"].append(precinct)

with open('Duplicate_Utah.json', 'w') as f:
    json.dump(enclosed_precincts, f)