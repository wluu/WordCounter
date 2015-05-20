/*
	1. generate a large regular expression
	2. use large regular expression and text editor to remove scene information like [Morning, bus stop. Stan and Kyle wait for the bus, and Kyle arrives]
	3. should probably add this part programmatically in util.js
*/

var START_REG_EXP = '\\[(',
	MORE_TOKEN = ' \\S+',
	OR_TOKEN = '|',
	END_REG_EXP = ')\\]',
	TIMES = 40;

var tokens = ['\\S+'];
var regExp = START_REG_EXP;

for(var i = 0; i < TIMES; i++) {
	regExp += tokens.toString().replace(/,/g, '');
	if(i === (TIMES - 1)) {
		regExp += END_REG_EXP;
	}
	else {
		regExp += OR_TOKEN;
		tokens.push(MORE_TOKEN);
	}
}

console.log(regExp);
