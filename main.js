var fs = require('fs'),
	Util = require('./util.js');

var processedFile = Util.processFile('./scripts/it_hits_the_fan_original.txt');
var wordCount = Util.countWordsIn(processedFile);
console.log(fs.readFileSync('./template.html', {encoding: 'utf8'}), Util.formatData(wordCount));
