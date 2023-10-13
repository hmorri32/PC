Mapping coding exercise

The goal of this exercise is to plot the locations of each record in data.csv file on a map and save a coverage polygon.
Each point should have some visual indicator of the value. For example higher concentrations should be red and lower ones should be green.

There should be a dropdown to choose between Ethane (C2H6) and Methane (Ch4).

React map gl should be used for the front end mapping visualization

Saving the coverage
	There should be an input field to set a buffer (in meters) around each point.
	Upon clicking "Save Coverage" the geometry will be saved to a database table with a timestamp, buffer size, and geom column.

Your backend should have 2 API calls
	get the data that is stored in the database (The csv file is your seed data).
	Save the coverage geom

The backend can be written in any language (C# preferred)
Its strongly encouraged to use an ORM to generate your database table and to read the data in your API call.


Please email back a zip file with all the code and instructions to run the app locally.


1. The emissions observations are collected from our mobile detection unit.
2. There will be overlapping points on the map and that is OK. If you want to cluster them go for it,
3. ppm for methane and ppb for ethane (parts per million, parts per billion)
4. A real world use case is a utility company is trying to cover their pipelines, so seeing what's been covered is helpful to know what still needs to be covered.