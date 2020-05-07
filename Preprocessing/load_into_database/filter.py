import json

with open('../Utah.json') as f:
    data = json.load(f)

enclosed_precincts = {
    "type": "FeatureCollection",
    "features": []
}

for precinct in data["features"]:
    if "errors" in precinct["properties"] and precinct["properties"]["errors"]:
        if any("Enclosed precinct" in e for e in precinct["properties"]["errors"]):
            enclosed_precincts["features"].append(precinct)

with open('Enclosed_Utah.json', 'w') as f:
    json.dump(enclosed_precincts, f)