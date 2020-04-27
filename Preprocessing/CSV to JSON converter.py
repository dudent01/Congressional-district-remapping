import csv
import json


csvFilePath = 'C:/Users/Denis/Software Engineering/Data/Utah/Utah_Census_Data_2013_All_Counties_Utah.csv'
jsonFilePath = 'C:/Users/Denis/Software Engineering/Data/Utah/Utah_Census_Data_2013_By_County.json'

data = {}           # Will store converted JSON data

with open(csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        id = rows['id']
        data[id] = rows

with open(jsonFilePath, 'w') as jsonFile:
    jsonFile.write(json.dumps(data, indent= 4))