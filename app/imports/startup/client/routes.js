/*
* @Author: Philipp
* @Date:   2016-10-05 16:35:36
* @Last Modified by:   Philipp
* @Last Modified time: 2016-10-06 12:39:36
*/

import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

import '/imports/ui/pages/main/main.js';
import '/imports/ui/layouts/basic/basic.js';

FlowRouter.route(['/'], {
    action: function(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'main'});
    }
});