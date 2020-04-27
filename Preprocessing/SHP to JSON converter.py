import shapefile
import json
from json import dumps

reader = shapefile.Reader("C:/Users/Denis/Software Engineering/Data/Utah/Demographics/PopPlacePts2010_Approx/PopPlacePts2010_Approx.shp")
fields = reader.fields[1:]
field_names = [field[0] for field in fields]
buffer = []
for sr in reader.shapeRecords():
    atr = dict(zip(field_names, sr.record))
    geom = sr.shape.__geo_interface__
    buffer.append(dict(type="Feature", geometry=geom, properties=atr))



geojson = open("C:/Users/Denis/Software Engineering/Data/Utah/Demographics/utah_demographics_v3.json", "w")
#geojson.write(dumps({"type": "FeatureCollection", "features": buffer}, indent=2) + "\n")
json.dump({"type": "FeatureCollection", "features": buffer}, geojson, indent=2)
geojson.close()

'''
import geopandas as gpd
file = gpd.read_file("C:/Users/Denis/Software Engineering/Data/Utah/Voting/ut_2016.shp")
file.to_file("C:/Users/Denis/Software Engineering/Data/Utah/Voting/utah_voting_data.json", driver="GeoJSON")
'''