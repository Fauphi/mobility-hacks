/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Radu Gota (radu@attic-studio.net)
* @Last Modified time: 2016-12-03 22:06:39
*/

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/api/connection/connection.js';
import '/imports/ui/components/header/header.js';
import '/imports/ui/components/footer/footer.js';
import './connection.html';

Template.connection.onCreated(function created() {
	this.subscribe('all-connections');

	Meteor.call('connection.getTimes', new Date(), function(err,res) {
		console.log(res);
		Session.set('timeData', res);
	});

	Meteor.call('connection.getTotals', 'Nordendstr.', new Date(), function(err,res) {
		console.log(res);
		Session.set('totalData', res);
	});
});

Template.connection.onRendered(function rendered(){
	// Session.set("statusColor", "red");
	Session.set("headerHeight", "expanded");
});

Template.connection.helpers({
	
});

Template.connection.events({
	
});