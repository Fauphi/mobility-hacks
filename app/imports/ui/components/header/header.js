/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Radu Gota (radu@attic-studio.net)
* @Last Modified time: 2016-12-03 21:23:55
*/

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './header.html';

Template.header.onCreated(function created() {
	// Session.set("statusColor", "green");
	// Session.set("headerHeight", "");
	Session.set("delay", {"status": true, "minutes": 2});
	Session.set("pastStep", "0");
	// 
	Tracker.autorun(function() {
	  var routeName = FlowRouter.getRouteName();
	  console.log("Current route name is: ", routeName);
	  
	});
});



Template.header.helpers({
	statusColor: function(){
		return Session.get("statusColor");
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

		if(next){
			var i = 0;
			if(next[i].timestamp > current){
				var minuteCount = Math.round((next[i].timestamp - current) / 60000) % 60;
				Session.set("minuteCount", minuteCount);
				return next[i];
			} else {
				i++
			}
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
				var x = i + 1
				,	diff = Math.round((data[x].timestamp - data[i].timestamp) / 60000) % 60
				if( diff > 20){
					return "large";
				} else if(diff < 10){
					return "small"
				} else {
					return "medium"
				};
			}
		}			
	}
});

Template.header.events({
	'click .goToMain': function(){
		FlowRouter.go('/');
	}
});



var messages = {

}