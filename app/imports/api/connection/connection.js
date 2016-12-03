/*
* @Author: Philipp
* @Date:   2016-12-03 13:13:34
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 13:15:03
*/

'use strict';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Connection = new Mongo.Collection('connection');

if(Meteor.isServer) {
    import './server/publications.js';

    Meteor.methods({
        'connection.insert'(data) {
            Connection.insert(data);
        }
    });
}

// Connection.attachSchema(new SimpleSchema({
// 	title: {
//         type: String,
//         label: "Title",
//         max: 200
//     }
// }));