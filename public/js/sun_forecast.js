var SunForecast = function () {
	var self = this;
    		
    			if (navigator.geolocation)
    			{
    				navigator.geolocation.getCurrentPosition(this.getSunForecast, SunErrors.geoError);
    			}
    			else
    			{
    				//alert('sorry bro, no geo for you');
    			}
    			return !!navigator.geolocation;	
};

SunForecast.prototype = {
	getSunForecast: function (position)
	{
		var self = SunForecast.prototype;
    	$.ajax({
    		type: "GET",
    		url: '/forecast',
    		dataType: 'json',
    		async: false,
    		data: {
    			"lat": position.coords.latitude,
    			"lon": position.coords.longitude,
    			"start": new Date().toString(),
    			"days": 7
    		},
    		success: self.displayForecast,
    		error: SunErrors.requestError
    	});
	},
	displayForecast: function (data)
	{
		var forecast = data.forecast;
		var $table = $('#forecast table tbody');
		$.each(forecast, function (index, stamp)
		{
			//console.log(stamp);
			var $row = $('<tr></tr>');
			var lct = new Date(Date.parse(stamp.local_current));
			var fct = (lct.getMonth() + 1) + "/" + lct.getDate() + "/" + lct.getFullYear();
			var cells = [fct, stamp.local_sunrise, stamp.local_sunset];
			//console.log(cells)
			$.each(cells, function(index, data)
			{
				//console.log(data);
				var $cell = $('<td></td>');
				$cell.text(data);
				$row.append($cell);
			});
			$table.append($row);
		});
    	$('#forecast').show();
	}
}