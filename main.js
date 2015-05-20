var fs = require('fs'),
	Util = require('./util.js');

var file = './scripts/it_hits_the_fan_processed.txt';
// populate template.html with data to generate a google bar chart
console.log(fs.readFileSync('./template.html', {encoding: 'utf8'}), Util.formatData(Util.countWordsIn(file)));
