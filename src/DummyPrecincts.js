export const DummyPrecincts = {
    "type": "FeatureCollection",
    "features": [

        {
            "type": "Feature",
            "state": "UT",
            "properties": {
                "NAME": "Precinct 1",
                "ERRORS": [
                    { "ID": 1, "PROBLEM": "Precinct 1 intersects Precinct 2" },
                    { "ID": 2, "PROBLEM": "Precinct 1 contains Precinct 3" }]
            },
            "information": {
                "population": 200,
                "votes": { "Republican": 80, "Democratic": 20 }
            }, "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [[-112.0, 37.0], [-112.0, 38.0], [-110.0, 38.0], [-110.0, 37.0]]
                ]
            }
        },

        {
            "type": "Feature", "properties": { "NAME": "Precinct 2", "ERRORS": [{ "ID": 1, "PROBLEM": "Precinct 2 intersects Precinct 1" }] }, "information": { "population": 150, "votes": { "Republican": 50, "Democratic": 50 } }, "geometry": {
                "type": "Polygon", "coordinates": [

                    [[-111.0, 37.5], [-111.0, 38.2], [-109.9, 38.2], [-109.9, 37.5]]

                ]
            }
        },

        {
            "type": "Feature", "properties": { "NAME": "Precinct 3", "ERRORS": [{ "ID": 2, "PROBLEM": "Precinct 3 inside Precinct 1" }] }, "information": { "population": 200, "votes": { "Republican": 25, "Democratic": 75 } }, "geometry": {
                "type": "Polygon", "coordinates": [

                    [[-112.0, 37.0], [-112.0, 37.1], [-111.9, 37.1], [-111.9, 37.0]]

                ]
            }
        },

        {
            "type": "Feature", "properties": { "NAME": "Precinct 4", "ERRORS": [{ "ID": 3, "PROBLEM": "Point precinct" }] }, "information": { "population": 100, "votes": { "Republican": 20, "Democratic": 80 } }, "geometry": {
                "type": "Polygon", "coordinates": [

                    [[-110.0, 39.8]]

                ]
            }
        },

        {
            "type": "Feature", "properties": { "NAME": "Precinct 5", "ERRORS": [{ "ID": 4, "PROBLEM": "Self-intersecting" }] }, "information": { "population": 87, "votes": { "Republican": 65, "Democratic": 35 } }, "geometry": {
                "type": "Polygon", "coordinates": [

                    [[-114.0, 37.0], [-113.0, 38.0], [-114.0, 38.0], [-113.0, 37.0]]

                ]
            }
        },

        {
            "type": "Feature", "properties": { "NAME": "Precinct 6", "ERRORS": [] }, "information": { "population": 250, "votes": { "Republican": 65, "Democratic": 35 } }, "geometry": {
                "type": "Polygon", "coordinates": [

                    [[-110.0, 40.0], [-110.0, 40.1], [-110.2, 40.1], [-110.2, 40.0]]

                ]
            }
        },

        {
            "type": "Feature", "properties": { "NAME": "Precinct 7", "ERRORS": [{ "ID": 5, "PROBLEM": "Ghost precinct - no population data" }] }, "information": { "population": 0, "votes": {} }, "geometry": {
                "type": "Polygon", "coordinates": [

                    [[-110.3, 40.2], [-110.3, 40.3], [-110.5, 40.3], [-110.5, 40.2]]

                ]
            }
        }

    ]
}