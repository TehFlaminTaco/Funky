const objects = require("./objects.js");
const parse = require("./parse.js");
const globals = {};

globals.print = function(){
	var a = [];
	for(var i=0; i < arguments.length; i++)
		a[i] = arguments[i];
	console.log(a.join(" "))
	return a[0];
}

var globalsScope = objects.newScope();
globalsScope.vars = globals;
module.exports = globalsScope;