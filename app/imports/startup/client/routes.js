/*
* @Author: Philipp
* @Date:   2016-10-05 16:35:36
* @Last Modified by:   Radu Gota (radu@attic-studio.net)
* @Last Modified time: 2016-12-03 15:10:31
*/

import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '/imports/ui/pages/main/main.js';
import '/imports/ui/pages/search/search.js';
import '/imports/ui/pages/add/add.js';
import '/imports/ui/pages/connection/connection.js';
import '/imports/ui/layouts/basic/basic.js';

FlowRouter.route(['/'], {
    action: function(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'main'});
    },
    name: "main"
});

FlowRouter.route(['/search'], {
    action: function(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'search'});
    },
    name: "search"
});

FlowRouter.route(['/add'], {
    action: function(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'add'});
    }
});

FlowRouter.route(['/connection'], {
    action: function(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'connection'});
    },
    name: "connection"
});