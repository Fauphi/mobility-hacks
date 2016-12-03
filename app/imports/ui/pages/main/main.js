/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 13:50:10
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

Template.main.helpers({
	favorites() {
		return [{name: 'Greifswalder', line: 'S41', direction: 'Ostbahnhof'}];
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