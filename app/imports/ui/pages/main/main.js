/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Radu Gota (radu@attic-studio.net)
* @Last Modified time: 2016-12-03 22:06:49
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
	Session.set("headerHeight", "");
	Session.set("statusColor", "green");


});

Template.main.helpers({
	favorites() {
		return [
			{from: 'Home', to: "Work", line: 'U8', station: 'Rosenthaler Platz'},
			{from: 'Home', to: "Gym", line: 'U6', station: 'Oranienburger Tor'},
			{from: 'Work', to: "Home", line: 'U2', station: 'Stadtmitte'}
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
		FlowRouter.go('/connection');
	}
});