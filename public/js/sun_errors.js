var SunErrors = {
	requestError: function (xhr, status, err) {
       	console.log(xhr.responseText);
       	console.debug('error:');
       	console.debug(status);
       	console.debug(err);
       	console.debug(err.message);
       	console.debug(err.stack);
	},
	geoError: function(error) {
   		switch(error.code) {
   	  	case error.TIMEOUT:
   	    		// Quick fallback when no suitable cached position exists.
   	   		doFallback();
   	    		// Acquire a new position object.
   	    		navigator.geolocation.getCurrentPosition(getSunriseSunset, errorCallback);
   	    		break;
   	  	default:
   	  		alert('oops! no position for you!');
   	  		break;
   	  	//case ... // treat the other error cases.
   		};
   	}
};