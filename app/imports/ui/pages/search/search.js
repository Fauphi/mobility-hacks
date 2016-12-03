/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 13:22:43
*/

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/api/connection/connection.js';
import '/imports/ui/components/header/header.js';
import '/imports/ui/components/footer/footer.js';
import './search.html';

Template.search.onCreated(function created() {
	this.subscribe('all-connections');
});

Template.search.helpers({
	
});

Template.search.events({
	
});