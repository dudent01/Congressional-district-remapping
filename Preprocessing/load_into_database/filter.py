import json

with open('../Utah.json') as f:
    data = json.load(f)

overlapping_precincts = {
    "type": "FeatureCollection",
    "features": []
}

for precinct in data["features"]:
    if "errors" in precinct["properties"] and precinct["properties"]["errors"]:
        if any("Overlapping precincts" in e for e in precinct["properties"]["errors"]):
            overlapping_precincts["features"].append(precinct)

with open('Overlapping_Utah.json', 'w') as f:
    json.dump(overlapping_precincts, f)