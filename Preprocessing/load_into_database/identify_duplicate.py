import json

with open('../Utah.json') as f:
    data = json.load(f)

enclosed_precincts = {
    "type": "FeatureCollection",
    "features": []
}

seen = set()
duplicates = []

for precinct in data["features"]:
    c_name = precinct["properties"]["cname"]
    if c_name in seen:
        duplicates.append(c_name)
    else:
        seen.add(c_name)

# with open('Duplicate_Utah.json', 'w') as f:
#     json.dump(enclosed_precincts, f)
print(duplicates)