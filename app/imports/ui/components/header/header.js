/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Radu Gota (radu@attic-studio.net)
* @Last Modified time: 2016-12-03 19:08:07
*/

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './header.html';

Template.header.onCreated(function created() {
	// Session.set("statusColor", "green");
	// Session.set("headerHeight", "");
	Session.set("delay", {"status": true, "minutes": 2});
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
	delay: function(){
		return Session.get("delay");
	}
});

Template.header.events({
	'click .goToMain': function(){
		FlowRouter.go('/');
	}
});



var messages = {

}