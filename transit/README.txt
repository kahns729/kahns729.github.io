README for MBTA T Subway Lines Web Application
	by Seth Kahn

Features implemented:
	Application renders a google map, retrieves user location via javascript's navigator.geolocation object, and plots user location on the map.
	Application renders a custom marker (with color matching line) for each stop along a given subway line (i.e. blue line, orange line, red line) and connects marker with an appropriately colored polyline.
	Upon being clicked, each marker displays an information window containing a table of train arrival times and directions at that station. This table is ordered from soonest arriving train to latest arriving train.
	Application calculates nearest subway station of a given line from the user and displays the information (which station and distance in miles) in the "You are Here" information window.
	When a 500 status code is received, the application still renders user's location, but displays "Could not load T line "