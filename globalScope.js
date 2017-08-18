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

globals.pairs = function(list){
	var keys = Object.keys(list.vars);
	var i = 0;
	return ()=>{
		var l = objects.newList();
		l.vars[0] = keys[i++];
		l.vars[1] = list.vars[l.vars[0]];
		if(l.vars[1]!=undefined)
			return l;
	}
}

globals.newEvent = function(){
	return objects.newEvent();
}

globals.newList = function(){
	var l = objects.newList();
	for(var i=0; i < arguments.length; i++){
		l.vars[i] = arguments[i];
	}
	return l;
}

globals.setParent = function(list, otherlist){
	list.parent = otherlist;
	return list;
}

globals.later = function(time, callback){
	var evnt = objects.newEvent();
	if(callback)
		evnt.vars.hook(callback);
	setTimeout(evnt.vars.call, time||0);
	return evnt;
}

globals.getMetaFunc = function(val, name){
	if(typeof val == "object"){
		if(typeof val.vars._meta == "object" && val.vars._meta.vars[name] !== undefined){
			return val.vars._meta.vars[name];
		}
	}

	if(typeof globals.defaultMeta == "object" && typeof globals.defaultMeta.vars[typeof val] == "object" && globals.defaultMeta.vars[typeof val].vars[name]!==undefined){
		return globals.defaultMeta.vars[typeof val].vars[name];	
	}
}
objects.getMetaFunc = globals.getMetaFunc;

globals.math = objects.newList();
globals.string = objects.newList();
globals.string.vars.format = function(str){
	var splt = str.match(/%.|./g)
	var out = "";
	var argi = 1;
	for(var i = 0; i < splt.length; i++){
		var s = splt[i];
		if(s[0]=="%"){
			var action = globals.string.vars.format[s[1].toLowerCase()]
			if(!action)
				throw "Unknown format type: "+s[1];
			out += action(arguments[argi++]);
		}else{
			out += s;
		}
	}
	return out;
}
globals.string.vars.format.s = s=>""+s;
globals.string.vars.format.q = s=>JSON.stringify(s);
globals.string.vars.format.i = s=>Math.floor(Number(s))
globals.string.vars.format.f = globals.string.vars.format.d = globals.string.vars.format.n = s=>Number(s)
globals.string.vars.format['%'] = ()=>'%'

globals.table = objects.newList();
globals.table.vars.rawGet = function(table, name){
	return table.vars[name];
}

globals.table.vars.rawSet = function(table, name, val){
	return table.vars[name] = val;
}

globals.defaultMeta = objects.newList();
globals.defaultMeta.vars.string = objects.newList();
globals.defaultMeta.vars.string.vars._index = globals.string;
globals.defaultMeta.vars.string.vars._mod = globals.string.vars.format


var globalsScope = objects.newScope();
globalsScope.vars = globals;

globals._G = globalsScope;

module.exports = globalsScope;