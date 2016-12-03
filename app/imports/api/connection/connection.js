/*
* @Author: Philipp
* @Date:   2016-12-03 13:13:34
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 23:38:57
*/

// 'use strict';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Connection = new Mongo.Collection('connection');

const CustomerCounts = new Mongo.Collection('customercounts');

const getCounts = (locationName, locationId, direction, directionName) => {
	const regex = new RegExp(locationName.trim(), 'g')
	,	countData = CustomerCounts.find({'Haltestelle': regex}).fetch();

	const hstArray = [];
	let directionObject = {};

	// extract all direction stops
	for(let item of countData) {
		if(hstArray.indexOf(item['Ab-Hst-Nr'])==-1) hstArray.push(item['Ab-Hst-Nr']);
	}

	console.log('Direectioins: ',hstArray);

	// find direction stop
	for(let j=0;j<hstArray.length;j++) {
		const startId = hstArray[j];

		const allWithSameStartId = CustomerCounts.find({'Ab-Hst-Nr': startId}).fetch();

		let lastHstNr = 0;
		let lastHst = null;
		let found = false;
		for(let i=0;i<allWithSameStartId.length;i++) {
			const item = allWithSameStartId[i];
			const hst = item['lfd-Hst'];
			
			// if(hst>=lastHst) {
			// 	lastHstNr = hst;
			// 	lastHst = item;
			// }

			if(item.Haltestelle==directionName) {
				directionObject = item;
				found = true;
				break;
			}
		}

		if(found) break;
		// console.log(lastHstNr);

		// if(lastHst.Haltestelle==directionName) {
		// 	directionObject = lastHst;
		// 	break;
		// }
	}	

	console.log(directionObject);

	const realCountData = CustomerCounts.find({'Haltestelle': regex, 'Ab-Hst-Nr': directionObject['Ab-Hst-Nr']}).fetch();
	
	const formatAbfahrtszeit = (time) => {
		var split = time.split(':')
		,	hours = (split[0].length==1)?'0'+split[0]:split[0]
		,	min = (split[1].length==1)?'0'+split[1]:split[1]
		,	sec = (split[2].length==1)?'0'+split[2]:split[2];
		return hours+':'+min+':'+sec;
	}

	// sort times
	const sorted = realCountData.sort(function(a,b) {
		const tmpDate = moment(new Date()).format('YYYY-MM-DD');
		
		const aTS = new Date(tmpDate+'T'+formatAbfahrtszeit(a.Abfahrtszeit)).getTime()
		,	bTS = new Date(tmpDate+'T'+formatAbfahrtszeit(b.Abfahrtszeit)).getTime();

		if(aTS>bTS) return 1;
		else if(aTS<bTS) return -1;
		else return 0;
	});

	let total = 0;

	// calc total customers
	for(let item of sorted) {
		// console.log(item.Haltestelle+': '+item.Abfahrtszeit);
		item.total = 0;
		const totalCountArray = CustomerCounts.find({'Ab-Hst-Nr': item['Ab-Hst-Nr'], Kurs: item.Kurs, 'PAG-Nr': item['PAG-Nr']}, {sort: {'lfd-Hst': 1}}).fetch();

		for(let k=0;k<totalCountArray.length;k++) {
			const countItem = totalCountArray[k];
			if(countItem.Haltestelle==item.Haltestelle) break;

			let diff = 0;
			diff += countItem.Einsteiger;
			diff -= countItem.Aussteiger;
			item.total += Math.round(diff);
		}

		// console.log('Total: ', item.total);
	}

	return {allTotals: sorted};
}

// const locationId = '009132502'
// ,	locationName = 'Nordendstr.'
// ,	direction = '009132014'
// ,	directionName = 'Rosenthal Nord';

// const locationId = '009131528'
// ,	locationName = 'Grabbeallee/Pastor-Niemöller-Pl.'
// ,	direction = '009130011'
// ,	directionName = 'U Vinetastr.';

const locations = {
	first: {
		locationId: '009132502',
		locationName: 'Nordendstr.',
		direction: '009132014',
		directionName: 'Rosenthal Nord'
	},
	second: {
		locationId: '009131528',
		locationName: 'Grabbeallee/Pastor-Niemöller-Pl.',
		direction: '009130011',
		directionName: 'U Vinetastr.'
	}
}

if(Meteor.isServer) {
    import './server/publications.js';

    Meteor.methods({
    	'connection.getTotals'(locKey) {
    		console.log('GET COUNTS');
    		const loc = locations[locKey]
			,	locationId = loc.locationId
			,	locationName = loc.locationName
			,	direction = loc.direction
			,	directionName = loc.directionName;

			return getCounts(locationName, locationId, direction, directionName);
    	},
    	'connection.getTimes'(currentDate, locKey) {
    		console.log('GET DEPARTURE TIMES');

    		const loc = locations[locKey]
			,	locationId = loc.locationId
			,	locationName = loc.locationName
			,	direction = loc.direction
			,	directionName = loc.directionName;

    		const getRequest = Meteor.wrapAsync(HTTP.call, HTTP)
			,	endParams = "&format=json&accessId=BVG-VBB-Dezember";

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

				const formattedTime = item.time.split(':')[0]+':'+item.time.split(':')[1]
				,	timestamp = new Date(tmpDate+'T'+item.rtTime).getTime();

				timeArray.push({time: formattedTime, timestamp: timestamp, direction: item.direction, delay: delay});
			}

			return timeArray;
    	},
   //      'connection.get'(searchString, currentDate) {
   //      	console.log('connection.get');
			// const getRequest = Meteor.wrapAsync(HTTP.call, HTTP)
			// ,	endParams = "&format=json&accessId=BVG-VBB-Dezember";

			// // get location by search string

			// const url1 = "http://demo.hafas.de/openapi/vbb-proxy/location.name?input="+searchString+"&maxNo=1&type=S"+endParams
			// ,	res1 = getRequest('GET', url1).data;

			// const location = res1.stopLocationOrCoordLocation[0].StopLocation;

			// if(!location) {
			// 	console.log('failed'); 
			// 	return;
			// }

			// const locationId = location.extId
			// ,	locationName = location.name.replace('(Berlin)', '');

			// // get delay
			// const startTime = moment(currentDate).format('HH:mm');

			// console.log(startTime);

			// // &time="+startTime+"&date="+currentDate+"
			// const url2 = "http://demo.hafas.de/openapi/vbb-proxy/departureBoard?id="+locationId+"&time="+startTime+"&maxJourneys=1"+endParams
			// ,	res2 = getRequest('GET', url2).data;

			// const departure = res2.Departure[0];

			// if(!departure) {
			// 	console.log('failed'); 
			// 	return;
			// }

			// const tmpDate = moment(currentDate).format('YYYY-MM-DD');

			// const timetable = new Date(tmpDate+'T'+departure.time).getTime()
			// ,	realtime = new Date(tmpDate+'T'+departure.rtTime).getTime()
			// ,	tmpDelay = (realtime - timetable) / (1000 * 60)
			// ,	delay = (tmpDelay<0)?tmpDelay*-1:tmpDelay
			// ,	direction = departure.direction;

			// // TODO: get other times
			// // for() {
			// // 	startTime+(i*10);
			// // }

			// // get customer counts by locationName
			// const regex = new RegExp(locationName.trim(), 'g')
			// ,	countData = CustomerCounts.find({'Haltestelle': regex}).fetch();

			// // get closest
			// var days = [];
			// for(let i=0;i<countData.length;i++) {
			// 	var time = countData[i]['Abfahrtszeit']
			// 	,	split = time.split(':')
			// 	,	hours = (split[0].length==1)?'0'+split[0]:split[0]
			// 	,	min = (split[1].length==1)?'0'+split[1]:split[1]
			// 	,	sec = (split[2].length==1)?'0'+split[2]:split[2]
			// 	,	formatted = hours+':'+min+':'+sec;
				
			// 	var date = moment(new Date(tmpDate+' '+formatted)).utcOffset(1).format();
			// 	days.push(new Date(date));
			// }

			// // console.log(days);

			// // real count data
			// const closest = getClosest(moment(new Date(tmpDate+' '+departure.time)).utcOffset(1).format(),days);
			// const realCountData = CustomerCounts.findOne({'Haltestelle': regex, 'Abfahrtszeit': moment(closest).format('HH:mm:SS')});

			// console.log(realCountData);
			
			// // console.log(countData);

			// // TODO: calc user count from start stop

			// console.log(departure.time+' => '+departure.rtTime);

			// // create return object
			// const result = {
			// 	locationName: locationName,
			// 	direction: departure.direction,
			// 	line: departure.name,
			// 	departureTime: departure.time.split(':')[0]+':'+departure.time.split(':')[1],
			// 	otherDepartureTimes: [],
			// 	delay: delay,
			// 	coords: {lon: location.lon, lat: location.lat}
			// };

			// console.log(result);
			// return result;
   //      }
    });
}

const getBerlinTime = (timeString) => {
	const tmpDate = moment(new Date()).format('YYYY-MM-DD');
	return moment(new Date(tmpDate+' '+timeString)).utcOffset(1).format();
}

const getClosest = function(testDate, days) {
	var bestPrevDate = days.length;
	var bestNextDate = days.length;

	var max_date_value = Math.abs((new Date(0,0,0).getTime()));

	var bestPrevDiff = max_date_value;
	var bestNextDiff = -max_date_value;

	var currDiff = 0;
	var i = 0;

	testDate = new Date(testDate).getTime();

	for(i = 0; i < days.length; ++i){
	   currDiff = testDate - new Date(getBerlinTime(days[i].Abfahrtszeit)).getTime();
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
	const nextDiff = testDate - new Date(getBerlinTime(days[bestNextDate])).getTime()
	,	prevDiff = testDate - new Date(getBerlinTime(days[bestPrevDate])).getTime();

	return (nextDiff<prevDiff)?days[bestNextDate]:days[bestPrevDate];
}