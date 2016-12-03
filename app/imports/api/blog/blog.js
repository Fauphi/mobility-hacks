/*
* @Author: Philipp
* @Date:   2016-06-28 20:16:10
* @Last Modified by:   philipp
* @Last Modified time: 2016-11-02 15:46:05
*/

'use strict';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Blog = new Mongo.Collection('blog');

if(Meteor.isServer) {
    import './server/publications.js';    

    Meteor.methods({
        'blog.insert'(data) {
            Blog.insert(data);
        },
        'blog.remove'(blogId) {
            Blog.remove(blogId);
        },
    });
}

Blog.attachSchema(new SimpleSchema({
	title: {
        type: String,
        label: "Title",
        max: 200
    }
}));