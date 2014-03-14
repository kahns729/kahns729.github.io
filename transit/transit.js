var xhr;
//stations of the relevant line
var stations = new Array();
var myLocation;
//html element with information to be displayed at location
var youAreHere = "<p>You are here.</p>";
//the line
var line;

function initialize(){
	//Boston
	latlng = new google.maps.LatLng(42.3581, -71.0636);
	//Create map centered on Boston
	myOptions = {center:latlng, zoom:13};
	map = new google.maps.Map(
		document.getElementById("map_canvas"),myOptions);
	//request station data (line, lat, long)
	xhr = new XMLHttpRequest();
	xhr.open("GET", 
		"http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
	//once data retrieved, run app's functionality
	xhr.onreadystatechange = dataReady;
	xhr.send(null);
};

function dataReady(){
	//successfully loaded data
	if(xhr.readyState == 4 && xhr.status == 200){
		//parse data
		schedule = JSON.parse(xhr.responseText);
		var pos = 0;
		line = schedule["line"];
		console.log(schedule);
		//choose relevant stations
		for (var i=0; i<stationsBefore.length;i++){
			if (stationsBefore[i][0].toLowerCase() == line){
				stations[pos] = stationsBefore[i];
				pos++;
			}
		}
		//plot the stations on the map and connect lines
		plotStations(stations);
		//retrieve user location and relevant data that follows
		getLocation();
	}
	//data didn't load correctly (500 error)
	else if (xhr.readyState == 4 && xhr.status == 500){
		var marker;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				lat = position.coords.latitude;
				lng = position.coords.longitude;
				myLocation = new google.maps.LatLng(lat,lng);
				map.panTo(myLocation);
				marker = new google.maps.Marker({
					position:myLocation,
					map: map,
					title: 'You are here.'
				});
			});
			//custom content to display at myLocation
			here = "<p>You are here.</br>Could not load T line.</p>"
			//display the content
			var myWindow = new google.maps.InfoWindow({
				content:here,
				maxWidth:200
			});
			//open the display window
			myWindow.open(map,marker);
		}
		else {
			console.log("error: geolocation not supported");
		}
	}
};

function plotStations(stations){
	var path = [];
	var markers = new Array();
	var image;
	if (line == "red")
		image = "red_MarkerT.png";
	else if (line == "blue")
		image = "blue_MarkerT.png";
	else if (line == "orange")
		image = "orange_MarkerT.png";
	for (var i=0;i<stations.length;i++){
		marker = new google.maps.Marker({
			position:new google.maps.LatLng(
				stations[i][2],stations[i][3]
				),
			map:map,
			icon:image,
			title:stations[i][1]
		});
		path[i] = new google.maps.LatLng(stations[i][2],stations[i][3]);
		google.maps.event.addListener(marker,'click',function(self){
			var infowindow = new google.maps.InfoWindow({
				content:getInfo(this.title)
			});
			infowindow.open(map,this);
		});
	}
	if (line == 'red'){
		path1 = path.slice(0,18);
		var redLine1 = new google.maps.Polyline({
    		path: path1,
    		geodesic: true,
	    	strokeColor: 'red',
	    	strokeOpacity: 1.0,
	    	strokeWeight: 6
  		});
  		redLine1.setMap(map);
  		path2 = path.slice(18,22);
  		//cross at JFK/UMass
		path2.unshift(new google.maps.LatLng(42.320685,-71.052391));
  		var redLine2 = new google.maps.Polyline({
  			path: path2,
  			geodesic: true,
  			strokeColor:'red',
  			strokeOpacity: 1.0,
  			strokeWeight: 6
  		});
  		redLine2.setMap(map);
	}
	else {
		if (line =='blue')
			color = 'blue';
		else if(line == 'orange')
			color = 'orange';
		var orangeorblue = new google.maps.Polyline({
    		path: path,
    		geodesic: true,
	    	strokeColor: color,
	    	strokeOpacity: 1.0,
	    	strokeWeight: 6
  		});
  		orangeorblue.setMap(map);
	}
};

function getLocation() {
	var lat = 0;
	var lng = 0;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			myLocation = new google.maps.LatLng(lat,lng);
			map.panTo(myLocation);
			var marker = new google.maps.Marker({
				position:myLocation,
				map: map,
				title: 'You are here.'
			});
		});
	}
	else {
		console.log("error: geolocation not supported");
	}
	/*
	//hard code location for now
	myLocation = new google.maps.LatLng(42.404036, -71.12024439999999)
	//center map on user's locations
	map.panTo(myLocation);
	//mark user's location
	var marker = new google.maps.Marker({
		position:myLocation,
		map:map,
		title: 'You are here'
	});*/
	findClosest();
	function findClosest(){
		var closestStation = stations[0];
		for (var i=1; i<stations.length;i++){
			if (distance(myLocation.lat(),myLocation.lng(),
				stations[i][2],stations[i][3]) <
				distance(myLocation.lat(),myLocation.lng(),
					closestStation[2],closestStation[3])){
				closestStation = stations[i];
			}
		}
		//custom content to display at myLocation
		youAreHere = youAreHere + "<p>Closest " + line 
			+ " line station is: "
			+ closestStation[1] + "</p>";
		youAreHere = youAreHere + "<p>Distance of " + 
			(distance(myLocation.lat(),myLocation.lng(),
				closestStation[2],closestStation[3]) *
			0.621371).toFixed(4) + " miles.</p>";
		//display the content
		var myWindow = new google.maps.InfoWindow({
				content:youAreHere,
				maxWidth:200
		});
		//open the display window
		myWindow.open(map,marker);
		//add a listener to open whenever marker is clicked
		google.maps.event.addListener(marker, 'click', function() {
    		myWindow.open(map,marker);
  		});
  		console.log(distance(20,20,21,21));
		//distance between two lats and longs
		function distance(lt1,ln1,lt2,ln2){
			function toRad(dgrs){
				return dgrs * Math.PI / 180;
			}
			var R = 6371;
			var dlt = toRad(lt2-lt1);
			var dln = toRad(ln2-ln1);
			var lt1 = toRad(lt1);
			var lt2 = toRad(lt2);
			var a = Math.sin(dlt/2)*Math.sin(dlt/2)+Math.sin(dln/2)*Math.sin(dln/2)*Math.cos(lt1)*Math.cos(lt2);
			var c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
			var d = R*c;
			return d;
		}
	}
};

//return string of html for the table to be shown in a station's info window
function getInfo(name){
	html = "<h3>" + name + "</h3>" + 
		"<table><tr><td>Line</td><td>Trip #</td><td>Direction</td><td>Time Remaining</tr></tr>";
	for (i = 0; i < schedule["schedule"].length; i++){
		destination = schedule["schedule"][i];
		//step 2: get list of stops
		stops = destination["Predictions"];
		for (j = 0; j < stops.length; j++){
			s = stops[j];
			if (s["Stop"] == name) {
				html = html + "<tr><td>" + line[0].toUpperCase() +line.slice(1) + "</td><td>"
					+ destination["TripID"] + "</td><td>" + 
					destination["Destination"] + "</td><td>" +
					s["Seconds"] + "</td></tr>";
			}
		}
	}
	return html + "</table>";
}
/*
function secondsToHHMMSS(seconds){
	
}*/

//array of stations. 
//each station is an array with 4 indices
//index 1: line
//index 2: station name
//index 3: longitude
//index 4: latitude
stationsBefore = [
	["Blue","Bowdoin",42.361365,-71.062037],
	["Blue","Government Center",42.359705,-71.05921499999999],
	["Blue","State Street",42.358978,-71.057598],
	["Blue","Aquarium",42.359784,-71.051652],
	["Blue","Maverick",42.36911856,-71.03952958000001],
	["Blue","Airport",42.374262,-71.030395],
	["Blue","Wood Island",42.3796403,-71.02286539000001],
	["Blue","Orient Heights",42.386867,-71.00473599999999],
	["Blue","Suffolk Downs",42.39050067,-70.99712259],
	["Blue","Beachmont",42.39754234,-70.99231944],
	["Blue","Revere Beach",42.40784254,-70.99253321],
	["Blue","Wonderland",42.41342,-70.991648],
	["Orange","Oak Grove",42.43668,-71.07109699999999],
	["Orange","Malden Center",42.426632,-71.07411],
	["Orange","Wellington",42.40237,-71.077082],
	["Orange","Sullivan",42.383975,-71.076994],
	["Orange","Community College",42.373622,-71.06953300000001],
	["Orange","North Station",42.365577,-71.06129],
	["Orange","Haymarket",42.363021,-71.05829],
	["Orange","State Street",42.358978,-71.057598],
	["Orange","Downtown Crossing",42.355518,-71.060225],
	["Orange","Chinatown",42.352547,-71.062752],
	["Orange","Tufts Medical",42.349662,-71.063917],
	["Orange","Back Bay",42.34735,-71.075727],
	["Orange","Mass Ave",42.341512,-71.083423],
	["Orange","Ruggles",42.336377,-71.088961],
	["Orange","Roxbury Crossing",42.331397,-71.095451],
	["Orange","Jackson Square",42.323132,-71.099592],
	["Orange","Stony Brook",42.317062,-71.104248],
	["Orange","Green Street",42.310525,-71.10741400000001],
	["Orange","Forest Hills",42.300523,-71.113686],
	["Red","Alewife",42.395428,-71.142483],
	["Red","Davis",42.39674,-71.121815],
	["Red","Porter Square",42.3884,-71.11914899999999],
	["Red","Harvard Square",42.373362,-71.118956],
	["Red","Central Square",42.365486,-71.103802],
	["Red","Kendall/MIT",42.36249079,-71.08617653],
	["Red","Charles/MGH",42.361166,-71.070628],
	["Red","Park Street",42.35639457,-71.0624242],
	["Red","Downtown Crossing",42.355518,-71.060225],
	["Red","South Station",42.352271,-71.05524200000001],
	["Red","Broadway",42.342622,-71.056967],
	["Red","Andrew",42.330154,-71.057655],
	["Red","JFK/UMass",42.320685,-71.052391],
	["Red","North Quincy",42.275275,-71.029583],
	["Red","Wollaston",42.2665139,-71.0203369],
	["Red","Quincy Center",42.251809,-71.005409],
	["Red","Quincy Adams",42.233391,-71.007153],
	["Red","Braintree",42.2078543,-71.0011385],
	["Red","Savin Hill",42.31129,-71.053331],
	["Red","Fields Corner",42.300093,-71.061667],
	["Red","Shawmut",42.29312583,-71.06573796000001],
	["Red","Ashmont",42.284652,-71.06448899999999]
]

