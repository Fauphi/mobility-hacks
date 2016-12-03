import { Meteor } from 'meteor/meteor';

import '/imports/api/connection/connection.js';

var fs = require("fs");

Meteor.startup(() => {
  	// code to run on server at startup
  
  // 	const Connection = new Mongo.Collection('customercounts');

  // 	console.log('startup');

  // 	var file = JSON.parse(fs.readFileSync('/opt/files/dataset.json'));

  // 	var from = 1001
  // 	,	to = 20000;

  // 	for(let i=from;i<to;i++) {
		// Connection.insert(file[i]);
  // 	}
  // 	console.log('inserted');
});
