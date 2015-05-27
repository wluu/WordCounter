var Util = require('./util.js');

var chosenFile = process.argv[2];
switch(chosenFile) {
	case 'southpark':
		startCounting(
			'./scripts/it_hits_the_fan.txt',
			'It Hits the Fan (Season 5, Episode 1)',
			'This bar chart displays the number of unique words conversed in South Park\\\'s episode \"It Hits the Fan\".'
		);
	break;

	case 'irongiant':
		startCounting(
			'./scripts/the_iron_giant.txt',
			'The Iron Giant',
			'This bar chart displays the number of unique words conversed in the movie \"The Iron Giant\".'
		);
	break;

	default:
		console.log('what is ' + chosenFile);
		process.exit(1);
}

function startCounting(file, chartTitle, chartSubtitle) {
	var processedFile = Util.processFile(file);
	var wordCount = Util.countWordsIn(processedFile);
	Util.printHtml('./template.html', Util.formatData(wordCount), chartTitle, chartSubtitle);
};
