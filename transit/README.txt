README for MBTA T Subway Lines Web Application
	by Seth Kahn

Features implemented:
	Application renders a google map, retrieves user location via javascript's navigator.geolocation object, and plots user location on the map.
	Application renders a custom marker (with color matching line) for each stop along a given subway line (i.e. blue line, orange line, red line) and connects marker with an appropriately colored polyline.
	Upon being clicked, each marker displays an information window containing a table of train arrival times and directions at that station. This table is ordered from soonest arriving train to latest arriving train.
	Application calculates nearest subway station of a given line from the user and displays the information (which station and distance in miles) in the "You are Here" information window.
	When a 500 status code is received, the application still renders user's location, but displays "Could not load T line" in "You are Here" information window and renders no stations or data about closest station.
	There are no features, as far as my testing can tell, that have not been correctly implemented.

Files included:
	index.html: basic page with canvas for map
	index.css: styles canvas and table of train arrivals
	transit.js: where all functionality of the project comes from
	red_MarkerT.png, orange_MarkerT.png, blue_MarkerT.png: icons for line markers

Approximately 10 hours were spent working on this assignment. I did not collaborate with anybody, but used sample code from course website as guidelines for my algorithms in some circumstances.