var Sunriser = function () {
    		var self = this;
    		
    			if (navigator.geolocation)
    			{
    				navigator.geolocation.getCurrentPosition(this.getSunriseSunset, SunErrors.geoError);
    			}
    			else
    			{
    				//alert('sorry bro, no geo for you');
    			}
    			return !!navigator.geolocation;
    	};
    	Sunriser.prototype = {
    		getSunriseSunset: function(position)
    		{
    			var self = Sunriser.prototype;
    			console.log(self);
    			console.log('sending sunrise/sunset data...');
    			console.log(position);
                var mapData;
                $.getJSON('http://nominatim.openstreetmap.org/reverse', {
                    format: 'json',
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    addressdetails: 1,
                    zoom: 18
                }, self.displayMapInfo);
    			$.ajax
    			({
    			    type: "GET",
    			    //the url where you want to sent the userName and password to
    			    url: '/times',
    			    dataType: 'json',
    			    async: false,
    			    //json object to sent to the authentication url
    			    data: {
    			    	"lat": position.coords.latitude,
    			    	"lon": position.coords.longitude,
    			    	"time": new Date().toString()
    			    },
    			    success: self.displaySunTimes,
    			    error: SunErrors.requestError,
    			    beforeSend: function (request, settings) {
    					$(request).bind("readystatechange", function (e) { alert("changed " + e.target.readyState); });
					}
    			});
    		},
            displayMapInfo: function (data)
            {
                console.log('OSM data:');
                console.log(data);
                if (data)
                {
                    var $map = $('<div id="map"></div>');
                    $('#current_location').text(data.display_name).append($map);

                    $('#latit').text(data.lat);
                    $('#longit').text(data.lon);
                    $('#location-data').show();
                    var map;
                    var hull = new L.LatLng(data.lat, data.lon);
                    map = new L.Map('map');
                    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                    var osmAttrib='Map data © openstreetmap contributors';
                    var osm = new L.TileLayer(osmUrl,{minZoom:8,maxZoom:18,attribution:osmAttrib});
                    
                    map.setView(hull,11);
                    map.addLayer(osm);
                    var marker = L.marker(hull).addTo(map);
                    var pop = L.popup().setLatLng(hull).setContent(data.display_name).addTo(map);
                }
            },
    		displaySunTimes: function (data)
    		{
    			console.debug(data);
    			$('#current_time').text(data.local_current);
    			$('#local_sunrise').text(data.local_sunrise);
    			$('#local_sunset').text(data.local_sunset);
                $('#local_daylight').text(data.is_daylight_now ? 'yes' : 'no');
    			$('#results').show();
    		}


    	}