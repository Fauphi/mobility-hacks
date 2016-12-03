/*
* @Author: Philipp
* @Date:   2016-12-03 13:13:34
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 18:57:37
*/

// 'use strict';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Connection = new Mongo.Collection('connection');

const CustomerCounts = new Mongo.Collection('customercounts');

if(Meteor.isServer) {
    import './server/publications.js';

    Meteor.methods({
    	'connection.getTimes'(searchString, currentDate) {
    		console.log('connection.getTimes');
    		const getRequest = Meteor.wrapAsync(HTTP.call, HTTP)
			,	endParams = "&format=json&accessId=BVG-VBB-Dezember";
    		
    		const locationId = '009132502'
			,	locationName = 'Nordendstr.'
			,	direction = '009132014';

			// get delay
			const startTime = moment(currentDate).format('HH:mm');

			const url2 = "http://demo.hafas.de/openapi/vbb-proxy/departureBoard?id="+locationId+"&direction="+direction+"&time="+startTime+"&maxJourneys=100"+endParams
			,	res2 = getRequest('GET', url2).data;

			const departureArray = res2.Departure;

			if(!departureArray) {
				console.log('failed'); 
				return;
			}

			const timeArray = [];

			for(let i=0;i<departureArray.length;i++) {
				const item = departureArray[i];

				const tmpDate = moment(currentDate).format('YYYY-MM-DD');

				const timetable = new Date(tmpDate+'T'+item.time).getTime()
				,	realtime = new Date(tmpDate+'T'+item.rtTime).getTime()
				,	tmpDelay = (realtime - timetable) / (1000 * 60);
				let delay = (tmpDelay<0)?tmpDelay*-1:tmpDelay;

				if(!delay) delay = 0;

				timeArray.push({time: item.time, direction: item.direction, delay: delay});
			}

			return timeArray;
    	},
        'connection.get'(searchString, currentDate) {
        	console.log('connection.get');
			const getRequest = Meteor.wrapAsync(HTTP.call, HTTP)
			,	endParams = "&format=json&accessId=BVG-VBB-Dezember";

			// get location by search string

			const url1 = "http://demo.hafas.de/openapi/vbb-proxy/location.name?input="+searchString+"&maxNo=1&type=S"+endParams
			,	res1 = getRequest('GET', url1).data;

			const location = res1.stopLocationOrCoordLocation[0].StopLocation;

			if(!location) {
				console.log('failed'); 
				return;
			}

			const locationId = location.extId
			,	locationName = location.name.replace('(Berlin)', '');

			// get delay
			const startTime = moment(currentDate).format('HH:mm');

			console.log(startTime);

			// &time="+startTime+"&date="+currentDate+"
			const url2 = "http://demo.hafas.de/openapi/vbb-proxy/departureBoard?id="+locationId+"&time="+startTime+"&maxJourneys=1"+endParams
			,	res2 = getRequest('GET', url2).data;

			const departure = res2.Departure[0];

			if(!departure) {
				console.log('failed'); 
				return;
			}

			const tmpDate = moment(currentDate).format('YYYY-MM-DD');

			const timetable = new Date(tmpDate+'T'+departure.time).getTime()
			,	realtime = new Date(tmpDate+'T'+departure.rtTime).getTime()
			,	tmpDelay = (realtime - timetable) / (1000 * 60)
			,	delay = (tmpDelay<0)?tmpDelay*-1:tmpDelay
			,	direction = departure.direction;

			// TODO: get other times
			// for() {
			// 	startTime+(i*10);
			// }

			// get customer counts by locationName
			const regex = new RegExp(locationName.trim(), 'g')
			,	countData = CustomerCounts.find({'Haltestelle': regex}).fetch();

			// get closest
			var days = [];
			for(let i=0;i<countData.length;i++) {
				var time = countData[i]['Abfahrtszeit']
				,	split = time.split(':')
				,	hours = (split[0].length==1)?'0'+split[0]:split[0]
				,	min = (split[1].length==1)?'0'+split[1]:split[1]
				,	sec = (split[2].length==1)?'0'+split[2]:split[2]
				,	formatted = hours+':'+min+':'+sec;
				
				var date = moment(new Date(tmpDate+' '+formatted)).utcOffset(1).format();
				days.push(new Date(date));
			}

			// console.log(days);

			// real count data
			const closest = getClosest(moment(new Date(tmpDate+' '+departure.time)).utcOffset(1).format(),days);
			const realCountData = CustomerCounts.findOne({'Haltestelle': regex, 'Abfahrtszeit': moment(closest).format('HH:mm:SS')});

			console.log(realCountData);
			
			// console.log(countData);

			// TODO: calc user count from start stop

			console.log(departure.time+' => '+departure.rtTime);

			// create return object
			const result = {
				locationName: locationName,
				direction: departure.direction,
				line: departure.name,
				departureTime: departure.time.split(':')[0]+':'+departure.time.split(':')[1],
				otherDepartureTimes: [],
				delay: delay,
				coords: {lon: location.lon, lat: location.lat}
			};
			console.log(result);
			return result;
        }
    });
}

const getClosest = function(testDate, days) {
	// var testDate = new Date(...);

	var bestPrevDate = days.length;
	var bestNextDate = days.length;

	var max_date_value = Math.abs((new Date(0,0,0).getTime()));

	var bestPrevDiff = max_date_value;
	var bestNextDiff = -max_date_value;

	var currDiff = 0;
	var i = 0;

	testDate = new Date(testDate).getTime();

	for(i = 0; i < days.length; ++i){
	   currDiff = testDate - days[i].getTime();
	   if(currDiff < 0 && currDiff > bestNextDiff){
	   // If currDiff is negative, then testDate is more in the past than days[i].
	   // This means, that from testDate's point of view, days[i] is in the future
	   // and thus by a candidate for the next date.
	       bestNextDate = i;
	       bestNextDiff = currDiff;
	   }
	   if(currDiff > 0 && currDiff < bestPrevDiff){
	   // If currDiff is positive, then testDate is more in the future than days[i].
	   // This means, that from testDate's point of view, days[i] is in the past
	   // and thus by a candidate for the previous date.
	       bestPrevDate = i;
	       bestPrevDiff = currDiff;
	   }   

	}
	/* days[bestPrevDate] is the best previous date, 
	   days[bestNextDate] is the best next date */
	return days[bestNextDate];
}

// Connection.attachSchema(new SimpleSchema({
// 	title: {
//         type: String,
//         label: "Title",
//         max: 200
//     }
// }));