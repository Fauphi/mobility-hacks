/*
* @Author: Philipp
* @Date:   2016-06-28 20:16:42
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 13:14:16
*/

'use strict';

import { Meteor } from 'meteor/meteor';
import { Connection } from '../connection.js';

Meteor.publish('all-connections', () => {
	return Connection.find({});
});