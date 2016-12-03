/*
* @Author: Philipp
* @Date:   2016-10-05 16:32:13
* @Last Modified by:   philipp
* @Last Modified time: 2016-11-02 16:04:53
*/

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Blog } from '/imports/api/blog/blog.js';

import '/imports/api/blog/blog.js';
import '/imports/ui/components/header/header.js';
import '/imports/ui/components/footer/footer.js';
import './main.html';

Template.main.onCreated(function created() {
	this.subscribe('all-blogs');
});

Template.main.helpers({
	getBlog() {
		return Blog.find();	
	},
	getCollection() {
		return Blog;
	}
});

Template.main.events({
	'click [data-action="add"]'() {
		Meteor.call('blog.insert', 'Hello World!');
	},
	'click [data-action="remove"]'() {
		Meteor.call('blog.remove', this._id);
	}
});