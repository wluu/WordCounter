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

exports.processFile = function(file) {
	// make everything lower case for easy processing
	var processedScript = fs.readFileSync(file, {encoding: 'utf8'}).toLowerCase();

	/*
		the method will help remove repeated string pattern in a script like:
		- character's beginning dialog scene e.g. kyle:
		- scene information e.g. [Morning, bus stop. Stan and Kyle wait for the bus, and Kyle arrives]

		the process:
		1. check if repeated string pattern exist
			- identify using a unique token
		2. if repeated string pattern exists, remove pattern with current regular expression e.g. \[\\S+\]
		3. increment middleToken e.g. \[\\S+ \\S+\]; append whitespace before middleToken
		4. repeat from 1
		5. if repeated string pattern doesn't exist anymore, return processed file

		param:
			startToken: beginning part of the regular expression e.g. \\[
			token: middle part of the regular expression e.g. \\S+
			endToken: end part of the regular expression e.g. \\]
			uniqueToken: token used to identify uniqueness with the repeated string pattern
			file: file to process
	*/
	function removeRepeats(startToken, middleToken, endToken, uniqueToken, script) {
		var tokens = [middleToken];
		var	uniqueExp = new RegExp(uniqueToken, 'mg');
		while(uniqueExp.test(script)) {
			var stringExp = startToken + tokens.toString().replace(/,/g, '') + endToken;
			var	replacerExp = new RegExp(stringExp, 'mg');
			script = script.replace(replacerExp, '');
			tokens.push(' ' + middleToken);
		}
		// before returning the processed script, remove any empty lines
		return script.replace(/^\n/g, '');
	};

	// character's beginning dialog -> ^\\S+\\n:
	processedScript = removeRepeats('^', '\\S+', ':\\n', ':\\n', processedScript);
	// scene information -> \\[\\S+\\]
	processedScript = removeRepeats('\\[', '\\S+', '\\]', '\\[', processedScript);

	var newScript = [];
	// seperate everything by whitespace or newline
	processedScript.split(/\s|\n/).forEach(function(someWord) {

		// removes all non-word characters (e.g. ! @ $ ,) before and after a word
		someWord = someWord.replace(/^(\W*)|(\W*)$/g, '');

		// ignore empty words (because of someWord.replace) and ignore stopwords
		if(someWord && !someWord.shouldIgnore()) {
			newScript.push(someWord);
		}
	});

	return newScript;
};

/*
	param:
		processedFile = ['STRING', 'STRING2' ...]
*/
exports.countWordsIn = function(processedFile) {
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
	param:
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
