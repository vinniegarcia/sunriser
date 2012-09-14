var locomotive = require('locomotive')
  , Controller = locomotive.Controller,
  SunriseSunset = require('../models/sunrise_sunset');

var PagesController = new Controller();

PagesController.main = function() {
  this.title = 'Sunriser'
  this.render();
}

PagesController.test = function () {
	this.hello = this.param('name');
	this.render({'format':'json'})
}

PagesController.getTimes = function () {
	this.lat = this.param('lat');
	this.lon = this.param('lon');
	var ltime = new Date(this.param('time'));
	if (ltime)
	{
	var sunriseSunset = new SunriseSunset(
		ltime.getUTCFullYear(), 
		ltime.getUTCMonth(), 
		ltime.getUTCDay(), 
		this.lat, 
		this.lon
	);
	var offset = parseFloat(ltime.getTimezoneOffset() / 60) * -1;
	this.utc_sunrise = sunriseSunset.sunriseUtcFriendly();
	this.utc_sunset = sunriseSunset.sunsetUtcFriendly();
	this.local_sunrise  = sunriseSunset.sunriseLocalFriendly(offset);
	this.local_sunset = sunriseSunset.sunsetLocalFriendly(offset);
	this.local_current = this.param('time');
	this.zone_offset = offset;
	this.is_daylight_now = sunriseSunset.isDaylight(ltime.getUTCHours());
	this.render({'format':'json'});
	}
	else
	{
		this.render("fuck");
	}
}

PagesController.forecast = function () {
	this.lat = this.param('lat') || 26;
	this.lon = this.param('lon') || -80;
	var today = new Date();
	if (!!Date.parse(this.param('start'))) {
		today = new Date(this.param('start'));
	};
	console.log(today);
	this.start = today;
	this.days = this.param('days') || 7;
	this.forecast = [];
	for (var i = 0; i < this.days; i++)
	{
		var nextDate = new Date();
		nextDate.setDate(today.getDate() + i);

		var sunriseSunset = new SunriseSunset(
			nextDate.getUTCFullYear(), 
			nextDate.getUTCMonth(), 
			nextDate.getUTCDay(), 
			this.lat, 
			this.lon
		);
		var offset = parseFloat(today.getTimezoneOffset() / 60) * -1;
		this.forecast.push({
			"utc_sunrise": sunriseSunset.sunriseUtcFriendly(),
			"utc_sunset": sunriseSunset.sunsetUtcFriendly(),
			"local_sunrise": sunriseSunset.sunriseLocalFriendly(offset),
			"local_sunset": sunriseSunset.sunsetLocalFriendly(offset),
			"local_current": nextDate.toString(),
			"zone_offset": offset
		});
	}
	this.render({'format': 'json'});
}

module.exports = PagesController;
