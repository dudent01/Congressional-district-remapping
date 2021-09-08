# Congressional-district-remapping

Web application displaying voting data by voting precinct for different states for multiple elections.

The goal of this application is to provide a visual interface that allows users to correct different types of errors in voting data and in precinct boundaries. The data is taken from publicly available precinct boundary datasets, which contain precinct boundary and voting data errors.

Some of the errors that our code identifies are:

* Overlapping precincts (precincts that share a geographic area, with tolerance of 200 feet of overlapping boundary)
* Enclosed precincts (precincts entirely contained within other precincts)
* Multipolygons (precincts that consist of multiple disconnected areas)
* Unclosed precincts (precincts with a boundary that is not closed - a curve, not a polygon)
* Map coverage errors (areas on the map that do not belong to any precinct that is defined in the dataset)
* Anamolous data (data about the precinct that contains a clear error - percentages not adding up)

These errors are identified by our preprocessing scripts that clean and analyze precinct boundary and voting data.

The user first selects a U.S. state. Our application supports Utah, West Virginia and California.
When a user queries for a specific type of error, the errors of that type are highlighted, and in addition presented in a side panel to the user. The user can select a specific error that has been identified by our algorithm, and can then fix the error, either by manually changing the data values that have been taken directly from the datasets, or by manually changing the voting precinct boundaries. The changes are immediately tested and propagated to the database of our application only if they fix the existing error and if they do not introduce new errors.
