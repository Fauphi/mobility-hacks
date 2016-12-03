import { Meteor } from 'meteor/meteor';

import '/imports/api/connection/connection.js';

Meteor.startup(() => {
  // code to run on server at startup
  
  console.log('startup');

});
