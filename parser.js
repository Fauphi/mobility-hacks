/*
* @Author: Philipp
* @Date:   2016-12-03 12:22:59
* @Last Modified by:   Philipp
* @Last Modified time: 2016-12-03 12:50:18
*/

'use strict';

//Converter Class 
var Converter = require("csvtojson").Converter;
var fs = require("fs");
var converter = new Converter({
	delimiter: ';',
	toArrayString: true
});

converter.on("end_parsed", function (jsonArray) {
	fs.writeFile('dataset.json', JSON.stringify(jsonArray[0]), function(err) {
 		if(!err) console.log('finished');
 		else console.log('failed');
 	});
});

fs.createReadStream("./dataset.csv").pipe(converter);

// check file
// var file = JSON.parse(fs.readFileSync('dataset.json'));
// console.log(file[0]);