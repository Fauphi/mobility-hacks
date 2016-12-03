/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 23:46:28
*/

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Blog } from '/imports/api/connection/connection.js';

import '/imports/api/connection/connection.js';
import '/imports/ui/components/header/header.js';
import '/imports/ui/components/footer/footer.js';
import './main.html';

Template.main.onCreated(function created() {
	this.subscribe('all-connections');
});

Template.main.onRendered(function rendered(){
	Session.set("statusColor", "green");
	Session.set("headerHeight", "");


});

Template.main.helpers({
	favorites() {
		return [
			{from: 'Home', to: "Work", line: 'Tram M1', station: 'Nordendstraße', location: 'first'},
			{from: 'Gym', to: "Schatzi", line: 'Bus 250', station: 'Grabbeallee/Pastor-Niemöller-Platz', location: 'second'}
			// {from: 'Work', to: "Home", line: 'U2', station: 'Stadtmitte'}
		];
	}
});

Template.main.events({
	'click [data-action="to-search"]'() {
		FlowRouter.go('/search');
	},
	'click [data-action="to-add"]'() {
		FlowRouter.go('/add');
	},
	'click [data-action="to-connection"]'() {
		Session.set('searchLocation', this.location);
		FlowRouter.go('/connection');
	}
});