var fs = require('fs'),
	stopWords = require('./stop_words.js');

// ignore words from the stop_words.js list
String.prototype.shouldIgnore = function() {
	for(var i = 0; i < stopWords.length; i++) {
		if(stopWords[i] === this.toString()) {
			return true;
		}
	}

	return false;
};

/*
	preprocess before reading the file in; should probably do this programmatically here instead of using remove_action.js:

	find character's beginning dialog scene e.g. kyle:
	(\S+|\S+ \S+|\S+ \S+ \S+|\S+ \S+ \S+ \S+|\S+ \S+ \S+ \S+ \S+):\n

	remove scene information e.g. [Morning, bus stop. Stan and Kyle wait for the bus, and Kyle arrives]
	\[(\S+|\S+ \S+|\S+ \S+ \S+|\S+ \S+ \S+ \S+\]
	see remove_action.js

*/
exports.countWordsIn = function(file) {

	var processedFile = (function preProcess() {
		// make everything lower case for easy counting
		var oldScript = fs.readFileSync(file, {encoding: 'utf8'}).toLowerCase(),
			newScript = [];

		// seperate everything by whitespace or newline
		oldScript.split(/\s|\n/).forEach(function(someWord) {

			// removes all non-word characters (e.g. ! @ $ ,) before and after a word
			someWord = someWord.replace(/^(\W*)|(\W*)$/g, '');

			// ignore empty words (because of someWord.replace) and ignore stopwords
			if(someWord && !someWord.shouldIgnore()) {
				newScript.push(someWord);
			}
		});

		return newScript;
	})();

	var trackedWords = {};
	processedFile.forEach(function(word) {
		if(trackedWords.hasOwnProperty(word)) {
			trackedWords[word]++;
		}
		else {
			trackedWords[word] = 1;
		}
	});
	return trackedWords;
};

/*
	rawData = {
		"word": NUMBER
		...
	}
*/
exports.formatData = function(rawData) {
	var table = '';
	for(var word in rawData) {
		// 4 tabs to fit %s string substitution in index.html
		table += '\t\t\t\t[\"' + word + '\", ' + rawData[word]  + '],\n';
	}
	return table;
};
