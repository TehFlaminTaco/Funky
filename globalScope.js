const objects = require("./objects.js");
const parse = require("./parse.js");
const stdin = require("./stdin.js");


const globals = {};

globals.print = function(){
	var a = [];
	for(var i=0; i < arguments.length; i++)
		a[i] = globals.toString(arguments[i]);
	console.log(a.join(" "))
	return a[0];
}

globals.write = function(){
	var a = [];
	for(var i=0; i < arguments.length; i++)
		a[i] = globals.toString(arguments[i]);
	process.stdout.write(a.join(""))
	return a[0];
}

globals.toString = s=>{
	f=globals.getMetaFunc(s, "_toString");
	if(f){
		if(typeof(f)=="function")
			return f(s)
		else
			return f
	}
	return s==undefined?"nil":s.toString()
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

globals.type = ent => typeof(ent)

globals.true = true;
globals.false = false;
globals.nil = undefined;

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
math.log = (a,b)=>typeof(b)=="number"?(Math.log(b)/Math.log(a)):Math.log(a)
math.random = (a,b)=>typeof(b)=="number"?
				Math.round(Math.random()*(b-a)+a):
					typeof(a)=="number"?
					math.random(1,a):
					Math.random()

// Trig
math.sin = a=>Math.sin(a)
math.cos = a=>Math.cos(a)
math.tan = a=>Math.tan(a)
math.asin = a=>Math.asin(a)
math.acos = a=>Math.acos(a)
math.atan = (a,b)=>typeof(b)=="number"?Math.atan2(a,b):Math.atan(a)
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
			var action = string.format[s[1]] || string.format[s[1].toLowerCase()]
			if(!action)
				throw "Unknown format type: "+s[1];
			out += action(arguments[argi++]);
		}else{
			out += s;
		}
	}
	return out;
}
string.format.s = s=>globals.toString(s);
string.format.u = s=>globals.toString(s).toUpperCase();
string.format.l = s=>globals.toString(s).toLowerCase()
string.format.c = s=>string.char(Number(s))
string.format.b = s=>string.byte(globals.toString(s))
string.format.q = s=>JSON.stringify(s);
string.format.i = s=>Math.floor(Number(s))
string.format.f = string.format.d = string.format.n = s=>Number(s)
string.format.x = s=>Number(s).toString(16)
string.format.X = s=>Number(s).toString(16).toUpperCase()
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

//////////////
// IO STUFF //
//////////////
globals.io = objects.newList();
var io = globals.io.vars

io.write = function(){
	var a = [];
	for(var i=0; i < arguments.length; i++)
		a[i] = globals.toString(arguments[i]);
	process.stdout.write(a.join(""))
	return a[0];
}
io.read = function(method){
	return stdin.read_line();
}

/////////////////
// TABLE STUFF //
/////////////////
globals.table = objects.newList();
var table = globals.table.vars

table.rawGet = function(t, name){
	return t.vars[name];
}

table.rawSet = function(t, name, val){
	return t.vars[name] = val;
}
table.apply = function(t, fn){
	var asList = [];
	for(var s in t.vars){
		asList[s] = t.vars[s]
	}
	return fn.apply(undefined, asList)
}
table.reverse = function(t){
	var len = globals.math.vars.len
	var inplen = len(t)
	var out = objects.newList()
	for(var i=inplen-1; i>=0; i--){
		out.vars[len(out)] = t.vars[i]
	}
	return out
}
table.insert = function(t, index, value){
	var ln = math.len(t)
	if(value==undefined){
		value = index
		index = ln
	}
	if(index==undefined){
		index = math.len(t);
	}
	for(var i=ln; i>index; i--){
		t.vars[i] = t.vars[i-1]
	}
	t.vars[index] = value;
	return t;
}
table.push = table.insert
table.remove = function(t, index){
	var ln = math.len(t)
	if(index == undefined){
		index = ln-1
	}
	var out = t.vars[index]
	for(var i=index; i<ln; i++){
		t.vars[i] = t.vars[i+1]
	}
	delete t.vars[ln-1]
	return out
}
table.pop = table.remove

table.len = t=>math.len(t)
table.rotate = (t, n)=>{
	n = n || 1;
	while(n>0){
		table.insert(t,0,table.pop(t));
		n--;
	}
	while(n<0){
		table.insert(t,table.remove(t,0));
		n++;
	}
	return t;
}

table.add = function(t,b){
	if(typeof(t)!="object"){
		var nT = objects.newList();
		nT.vars[0] = t;
		t = nT
	}
	if(typeof(b)!="object"){
		var nB = objects.newList();
		nB.vars[0] = b;
		b = nB
	}
	for(var i=0; i < table.len(b); i++){
		table.push(t,b.vars[i]);
	}
	return t;
}

table.merge = function(t,b){
	for(var name in b.vars){
		t.vars[name] = b.vars[name]
	}
	return t;
}

table.clone = function(t){
	var newT = objects.newList()
	for(var name in t.vars){
		if(typeof(t.vars[name])=="object"){
			newT.vars[name] = table.clone(t.vars[name]);
		}else{
			newT.vars[name] = t.vars[name]
		}
	}
	return newT
}

globals.defaultMeta = objects.newList();
globals.defaultMeta.vars.string = objects.newList();
globals.defaultMeta.vars.string.vars._index = globals.string;
globals.defaultMeta.vars.string.vars._mod = (a,b)=>{
	if(typeof(b)=="object"){
		return table.apply(table.add(a, b), string.format)
	}else{
		return string.format(a, b)
	}
}
globals.defaultMeta.vars.string.vars._mult = (a,b)=>typeof(a)=="string"&&typeof(b)=="number"?
								   string.rep(a,b) :typeof(a)=="number"&&typeof(b)=="string"?
								   string.rep(b,a) :undefined;

globals.defaultMeta.vars.object = objects.newList();
globals.defaultMeta.vars.object.vars._index = globals.table;

globals.defaultMeta.vars.function = objects.newList();
globals.defaultMeta.vars.number = objects.newList();
globals.defaultMeta.vars.boolean = objects.newList();
globals.defaultMeta.vars.undefined = objects.newList();


var globalsScope = objects.newScope(undefined,true);
globalsScope.vars = globals;

globals._G = globalsScope;

module.exports = globalsScope;