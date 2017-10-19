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

globals.keys = function(list){
	var keys = Object.keys(list.vars);
	var i = 0;
	return ()=>{
		var l = keys[i++];
		if(l!=undefined)
			return l;
	}
}

globals.values = function(list){
	var keys = Object.keys(list.vars);
	var i = 0;
	return ()=>{
		var l = objects.newList();
		var key = keys[i++]
		var val = list.vars[key];
		if(val!=undefined)
			return val;
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

///////////////////////////////////////
// SPECIAL SECTION DECICATED TO MATH //
///////////////////////////////////////
globals.math = objects.newList();
var math = globals.math.vars;
// Constants
math.pi = Math.PI
math.e = Math.exp(1)

// Numbers
math.sqrt = Math.sqrt
math.round = (a,b)=>Math.round(a*10**(b||0))/10**(b||0)
math.floor = (a,b)=>Math.floor(a*10**(b||0))/10**(b||0)
math.ceil  = (a,b)=>Math.ceil (a*10**(b||0))/10**(b||0)
math.max = Math.max
math.min = Math.min
math.clamp = (a,b,c)=>[a,b,c].sort()[1]
math.log = (a,b)=>b?(Math.log(b)/Math.log(a)):Math.log(a)

// Trig
math.sin = a=>Math.sin(a)
math.cos = a=>Math.cos(a)
math.tan = a=>Math.tan(a)
math.asin = a=>Math.asin(a)
math.acos = a=>Math.acos(a)
math.atan = (a,b)=>b?Math.atan2(a,b):Math.atan(a)
math.deg = a=>a/Math.PI*180
math.rad = a=>a/180*Math.PI

//////////////////
// STRING STUFF //
//////////////////
globals.string = objects.newList();
var string = globals.string.vars;

// Format
string.format = function(str){
	var splt = str.match(/%.|./g)
	var out = "";
	var argi = 1;
	for(var i = 0; i < splt.length; i++){
		var s = splt[i];
		if(s[0]=="%"){
			var action = string.format[s[1].toLowerCase()]
			if(!action)
				throw "Unknown format type: "+s[1];
			out += action(arguments[argi++]);
		}else{
			out += s;
		}
	}
	return out;
}
string.format.s = s=>""+s;
string.format.q = s=>JSON.stringify(s);
string.format.i = s=>Math.floor(Number(s))
string.format.f = string.format.d = string.format.n = s=>Number(s)
string.format['%'] = ()=>'%'

// Basic Manipulation
string.rep = (s,n)=>s.repeat(n)
string.reverse = s=>s.split("").reverse().join("")
string.lower = s=>s.toLowerCase()
string.upper = s=>s.toUpperCase()

// Character Code Stuff
string.byte = s=>String.charCodeAt(s,0)
string.char = s=>String.fromCharCode(s)

// Regex stuff
string.gsub = (a,b,c)=>a.replace(new RegExp(b,'g'),c)
string.match = (a,b)=>objects.ListFromObject(a.match(new RegExp(b)))
string.gmatch = (s, regex)=>{
	var reg = new RegExp(regex,"g");
	return ()=>{
		var oot = objects.ListFromObject(reg.exec(s));
		if(oot.vars.index!=undefined){
			return oot
		}
	}
}

/////////////////
// TABLE STUFF //
/////////////////
globals.table = objects.newList();
var table = globals.table.vars

table.rawGet = function(table, name){
	return table.vars[name];
}

table.rawSet = function(table, name, val){
	return table.vars[name] = val;
}
table.apply = function(table, fn){
	var asList = [];
	for(var s in table.vars){
		asList[s] = table.vars[s]
	}
	return fn[0].apply(undefined, asList)
}
table.reverse = function(table){
	var len = globals.math.vars.len
	var inplen = len(table)
	var out = objects.newList()
	for(var i=inplen-1; i>=0; i--){
		out.vars[len(out)] = table.vars[i]
	}
	return out
}

globals.defaultMeta = objects.newList();
globals.defaultMeta.vars.string = objects.newList();
globals.defaultMeta.vars.string.vars._index = globals.string;
globals.defaultMeta.vars.string.vars._mod = string.format;

globals.defaultMeta.vars.object = objects.newList();
globals.defaultMeta.vars.object.vars._index = globals.table;

var globalsScope = objects.newScope();
globalsScope.vars = globals;

globals._G = globalsScope;

module.exports = globalsScope;