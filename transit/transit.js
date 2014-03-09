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
	myOptions = {center:latlng, zoom:14};
	map = new google.maps.Map(
		document.getElementById("map_canvas"),myOptions);
	//request station data (line, lat, long)
	xhr = new XMLHttpRequest();
	xhr.open("GET", 
		"http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
	//once data retrieved, run app's functionality
	xhr.onreadystatechange = dataReady;
	xhr.send(null);
}

function dataReady(){
	//successfully loaded data
	if(xhr.readyState == 4 && xhr.status == 200){
		//parse data
		schedule = JSON.parse(xhr.responseText);
		var pos = 0;
		line = schedule["line"];
		//choose relevant stations
		for (var i=0; i<stationsBefore.length;i++){
			if (stationsBefore[i][0].toLowerCase() == line){
				stations[pos] = stationsBefore[i];
				pos++;
			}
		}
		//plot the stations on the map
		plotStations(stations);
		//retrieve user location and relevant data that follows
		getLocation();
	}
	//data didn't load correctly (500 error)
	else if (xhr.readyState == 4 && xhr.status == 500){
		console.log("error");
	}
}

function plotStations(stations){
	var markers = new Array();
	for (var i=0;i<stations.length;i++){
		markers[i] = new google.maps.Marker({
			position:new google.maps.LatLng(
				stations[i][2],stations[i][3]
				),
			map:map,
			title:stations[i][1]
		})
	}
}

function getLocation() {
	/*
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
	*/
	//hard code location for now
	myLocation = new google.maps.LatLng(42.404036, -71.12024439999999)
	//center map on user's locations
	map.panTo(myLocation);
	//mark user's location
	var marker = new google.maps.Marker({
		position:myLocation,
		map:map,
		title: 'You are here'
	});
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
				content:youAreHere
		});
		//open the display window
		myWindow.open(map,marker);
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
}



//array of stations. 
//each station is an array with 4 indices
//index 1: line
//index 2: station name
//index 3: longitude
//index 4: latitude
stationsBefore = [
	["Blue","Airport",42.374262,-71.030395],
	["Blue","Aquarium",42.359784,-71.051652],
	["Blue","Beachmont",42.39754234,-70.99231944],
	["Blue","Bowdoin",42.361365,-71.062037],
	["Blue","Government Center",42.359705,-71.05921499999999],
	["Blue","Maverick",42.36911856,-71.03952958000001],
	["Blue","Orient Heights",42.386867,-71.00473599999999],
	["Blue","Revere Beach",42.40784254,-70.99253321],
	["Blue","State Street",42.358978,-71.057598],
	["Blue","Suffolk Downs",42.39050067,-70.99712259],
	["Blue","Wonderland",42.41342,-70.991648],
	["Blue","Wood Island",42.3796403,-71.02286539000001],
	["Orange","Back Bay",42.34735,-71.075727],
	["Orange","Chinatown",42.352547,-71.062752],
	["Orange","Community College",42.373622,-71.06953300000001],
	["Orange","Downtown Crossing",42.355518,-71.060225],
	["Orange","Forest Hills",42.300523,-71.113686],
	["Orange","Green Street",42.310525,-71.10741400000001],
	["Orange","Haymarket",42.363021,-71.05829],
	["Orange","Jackson Square",42.323132,-71.099592],
	["Orange","Malden Center",42.426632,-71.07411],
	["Orange","Mass Ave",42.341512,-71.083423],
	["Orange","North Station",42.365577,-71.06129],
	["Orange","Oak Grove",42.43668,-71.07109699999999],
	["Orange","Roxbury Crossing",42.331397,-71.095451],
	["Orange","Ruggles",42.336377,-71.088961],
	["Orange","State Street",42.358978,-71.057598],
	["Orange","Stony Brook",42.317062,-71.104248],
	["Orange","Sullivan",42.383975,-71.076994],
	["Orange","Tufts Medical",42.349662,-71.063917],
	["Orange","Wellington",42.40237,-71.077082],
	["Red","Alewife",42.395428,-71.142483],
	["Red","Andrew",42.330154,-71.057655],
	["Red","Ashmont",42.284652,-71.06448899999999],
	["Red","Braintree",42.2078543,-71.0011385],
	["Red","Broadway",42.342622,-71.056967],
	["Red","Central Square",42.365486,-71.103802],
	["Red","Charles/MGH",42.361166,-71.070628],
	["Red","Davis",42.39674,-71.121815],
	["Red","Downtown Crossing",42.355518,-71.060225],
	["Red","Fields Corner",42.300093,-71.061667],
	["Red","Harvard Square",42.373362,-71.118956],
	["Red","JFK/UMass",42.320685,-71.052391],
	["Red","Kendall/MIT",42.36249079,-71.08617653],
	["Red","North Quincy",42.275275,-71.029583],
	["Red","Park Street",42.35639457,-71.0624242],
	["Red","Porter Square",42.3884,-71.11914899999999],
	["Red","Quincy Adams",42.233391,-71.007153],
	["Red","Quincy Center",42.251809,-71.005409],
	["Red","Savin Hill",42.31129,-71.053331],
	["Red","Shawmut",42.29312583,-71.06573796000001],
	["Red","South Station",42.352271,-71.05524200000001],
	["Red","Wollaston",42.2665139,-71.0203369]
]

