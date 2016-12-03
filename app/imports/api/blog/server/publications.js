/*
* @Author: Philipp
* @Date:   2016-06-28 20:16:42
* @Last Modified by:   philipp
* @Last Modified time: 2016-11-02 15:41:20
*/

'use strict';

import { Meteor } from 'meteor/meteor';
import { Blog } from '../blog.js';

Meteor.publish('all-blogs', () => {
	return Blog.find({});
});