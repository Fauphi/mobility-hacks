/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 18:58:05
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

	Meteor.call('connection.get', 'Nordendstr.', new Date(), function(err,res) {
		console.log(err);
		console.log(res);
		Session.set('connectionData', res);
	});

	Meteor.call('connection.getTimes', $elm.val(), new Date(), function(err,res) {
		console.log(res);
		Session.set('timeData', res);
	});
});

Template.connection.onRendered(function rendered(){
	Session.set("statusColor", "red");
	Session.set("headerHeight", "expanded");
});

Template.connection.helpers({
	
});

Template.connection.events({
	
});