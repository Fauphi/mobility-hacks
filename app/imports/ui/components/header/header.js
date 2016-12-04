/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-04 11:37:07
*/

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './header.html';

Template.header.onCreated(function created() {
	Session.set("delay", {"status": true, "minutes": 2});
	Session.set("pastStep", "0");
	Tracker.autorun(function() {
		var routeName = FlowRouter.getRouteName();
	});
});



Template.header.helpers({
	statusColor: function(){
		const times = Session.get('timeData')
		,	totals = Session.get('totalData');
		
		let	result = 'green';

		if(times && totals) {
			var clock = times[0]
			,	bt = getBerlinTime(clock.time);
			
			var data = getClosest(bt, totals.allTotals);

			if(data){
				if(data.total<15) result = 'green';
				else if (data.total<14 && data.total>24) result = 'orange';
				else result = 'red';
			}

			// console.log('Background-Color: ', result);
			return result;
		} else {
			// console.log('Background-Color: ', result);
			return result;
		}
		
	},
	headerHeight: function(){
		return Session.get("headerHeight");
	},
	timeData: function(){
		return Session.get('timeData');
	},
	nextTime: function(){
		var current = new Date().getTime();
		// var current = Math.floor(Date.now() / 1000);
		var next = Session.get('timeData');

		if(next[0].timestamp > current){
			const nextHourCorrected = Number(moment(next[0].timestamp).format('HH'))-1
			,	corretedNext = moment(next[0].timestamp).hour(nextHourCorrected).toDate().getTime();
			
			// console.log(moment(current).format('HH:mm')+' - '+moment(corretedNext).format('HH:mm'));

			var minuteCount = Math.ceil((corretedNext - current) / 60000) % 60;
			Session.set("minuteCount", minuteCount);
			return next[0];
		} else {
			// refresh data if first time has passed
			Meteor.call('connection.getTimes', new Date(), function(err,res) {
				Session.set('timeData', res);
			});
		}
		
	},
	// shrinks main minute display to fit screen size
	longTime: function(){
		// console.log();
		if (this.toFixed() > 9){
			return true;
		}
	},
	// minute count for main display
	minuteCount: function(){
		return Session.get("minuteCount");
	},
	isMain: function(){
		let routeName = FlowRouter.getRouteName();
		if(routeName == "main"){
			return true;
		}
	},
	isConnection: function(){
		let routeName = FlowRouter.getRouteName();
		if(routeName == "connection"){
			return true;
		}
	},
	hasDelay: function(){
		if(this.delay > 0){
			return true;
		}
	},
	timeSteps: function(){
		var selected = this.timestamp;
		var data = Session.get('timeData');
		if(data){
			for(i = 0; i < data.length; i++){
				var x = Math.min(data.length - 1, i + 1)
				,	diff = Math.round((data[x].timestamp - data[i].timestamp) / 60000) % 60;
				// console.log(data[x].timestamp - data[i].timestamp);
				if( diff > 15){
					return "large";
				} else if(diff < 8){
					return "small"
				} else {
					return "medium"
				};
			}
		}	
					
	},
	getPreviousTime(index){
		const i = Math.max(index-1,0)
		,	t = Session.get('timeData')
		,	s = Session.get('totalData');

		// console.log('Prev: ',i);

		if(t) testDate = getBerlinTime(t[i].time);
		
		if(s && t){
			var total = getClosest(testDate, s.allTotals).total;

			return getTotalColor(total);
		}
	},
	getClosest(time) {
		const t = time || moment(new Date()).format('HH:mm')
		,	s = Session.get('totalData')
		,	testDate = getBerlinTime(t);

		if(s){
			const closest = getClosest(testDate, s.allTotals)
			,	total = (closest)?closest.total:0;

			// if(closest) console.log('---- '+time+': '+total+' ('+closest.Abfahrtszeit+')');
			// else console.log('not found');

			return getTotalColor(total);
		}
	}

});

var getTotalColor = (total) => {
	if(total < 15){
		return "#57AF83";
	} else if(total > 14 && total < 24 ){
		return "#F4A66D";
	} else {
		return "#D05D5D";
	}
}

Template.header.events({
	'click .goToMain': function(){
		FlowRouter.go('/');
	}
});

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

	const testTime = moment(testDate).format('HH:mm');
	// console.log(testDate);
	testDate = new Date(new Date(getBerlinTime(testTime))).getTime();

	for(i = 0; i < days.length; ++i){
	   currDiff = testDate - new Date(getBerlinTime(days[i].Abfahrtszeit)).getTime();
	   // console.log(new Date(getBerlinTime(days[i].Abfahrtszeit)));
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
	if(days[bestNextDate] && days[bestPrevDate]) {
		const nextDiff = new Date(getBerlinTime(days[bestNextDate].Abfahrtszeit)).getTime() - testDate
		,	prevDiff = testDate - new Date(getBerlinTime(days[bestPrevDate].Abfahrtszeit)).getTime();	

		const result = (nextDiff<prevDiff)?days[bestNextDate]:days[bestPrevDate];

		return result;
	}
	
	
}