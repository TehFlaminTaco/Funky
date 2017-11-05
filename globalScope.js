const objects = require("./objects.js");
const parse = require("./parse.js");
const stdin = require("./stdin.js");


const globals = {};

/**
 * Write strings to STDOUT, terminated by a newline and separated by spaces.
 * @global
 * @function
 * @name print
 * @param {...*} text - What to write to the console. Implicitly stringified.
 * @returns {string} arg1 - The stringified representation of the first argument.
 */
globals.print = function(){
	var a = [];
	for(var i=0; i < arguments.length; i++)
		a[i] = globals.toString(arguments[i]);
	console.log(a.join(" "))
	return a[0];
}

/**
 * Write strings to STDOUT.
 * @global
 * @function
 * @name write
 * @param {...*} text - What to write to the console. Implicitly stringified.
 * @returns {string} arg1 - The stringified representation of the first argument.
 */
globals.write = function(){
	var a = [];
	for(var i=0; i < arguments.length; i++)
		a[i] = globals.toString(arguments[i]);
	process.stdout.write(a.join(""))
	return a[0];
}

/**
 * Convert an object to a string. Calls the object's _toString metamethod if provided.
 * @global
 * @function
 * @name toString
 * @param {*} object - The object to stringify.
 * @returns {string} string - The stringified output.
 */
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

/**
 * Make an iterator for an input object. Value for the iterator is an object containing the current key and value pair.
 * @global
 * @function
 * @name pairs
 * @param {Object} list - The list to iterate through
 * @returns {function} iterator - The iterator function.
 */
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

/**
 * Make an iterator for an input object. Value for the iterator is the current key.
 * @global
 * @function
 * @name keys
 * @param {Object} list - The list to iterate through
 * @returns {function} iterator - The iterator function.
 * @see pairs
 */
globals.keys = function(list){
	var keys = Object.keys(list.vars);
	var i = 0;
	return ()=>{
		var l = keys[i++];
		if(l!=undefined)
			return l;
	}
}

/**
 * Make an iterator for an input object. Value for the iterator is the current value.
 * @global
 * @function
 * @name values
 * @param {Object} list - The list to iterate through
 * @returns {function} iterator - The iterator function.
 * @see pairs
 */
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

/**
 * Create a new event. Can be hooked into with a when statement.
 * @global
 * @function
 * @name newEvent
 * @returns {Event} event - The new event object.
 */
globals.newEvent = function(){
	return objects.newEvent();
}

/**
 * Create a new object. Functions similarly to {...}
 * @global
 * @function
 * @name newList
 * @returns {Object} list - The new object.
 */
globals.newList = function(){
	var l = objects.newList();
	for(var i=0; i < arguments.length; i++){
		l.vars[i] = arguments[i];
	}
	return l;
}

/**
 * Set the parent of one object to another. Undefined keys of an object fall through to its parent.
 * @global
 * @function
 * @name setParent
 * @param {Object} list - The target list
 * @param {Object} parent - The target parent
 * @returns {Object} list - The input list argument, now modified.
 */
globals.setParent = function(list, otherlist){
	list.parent = otherlist;
	return list;
}

/**
 * Generate an event to fire in a certain number of milliseconds.
 * @global
 * @async
 * @function
 * @name later
 * @param {number} time - How long in milliseconds to wait before firing.
 * @param {function} [callback] - A function to hook to.
 * @returns {Event} event - The event created.
 */
globals.later = function(time, callback){
	var evnt = objects.newEvent();
	if(callback)
		evnt.vars.hook(callback);
	setTimeout(evnt.vars.call, time||0);
	return evnt;
}

/**
 * Try to run a function. Returns {bsuccess, result/errorcode}
 * @global
 * @function
 * @name pcall
 * @param {function} tocall - The function to try to execute.
 * @param {...*} arguments - The arguments to call on the function.
 * @returns {Object} data - An object contain whether or not the execution was successful and the return value / error message.
 */
globals.pcall = function(func,...args){
	var out = objects.newList()
	try{
		out.vars[1] = func(...args)
		out.vars[0] = true;
		return out;
	}catch(e){
		out.vars[0] = false;
		out.vars[1] = e.toString()
		return out;
	}
}

/**
 * Throw an error with a giving string as the text.
 * @global
 * @function
 * @name error
 * @param {string} [text] - The string to error. 
 */
globals.error = function(str){
	throw(str||"");
}

/**
 * Returns the metafunction of a given name of an input value.
 * @global
 * @function
 * @name getMetaFunc
 * @param {*} object - The object to look in
 * @param {string} metamethod - The name of the metamethod to lookup.
 * @returns {function} The metamethod.
 */
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

/**
 * Get the type of an object.
 * @global
 * @function
 * @name type
 * @param {*} object - The object to determine the type of.
 * @returns {string} type - The string referring to the type of the input object.
 */
globals.type = ent => typeof(ent)

/** @constant
    @global
    @type {boolean}
    @default true
    @name true
 */
globals.true = true;
/** @constant
    @global
    @type {boolean}
    @default false
    @name false
 */
globals.false = false;
/** @constant
    @global
    @type {undefined}
    @default nil
    @name nil
 */
globals.nil = undefined;

objects.getMetaFunc = globals.getMetaFunc;

///////////////////////////////////////
// SPECIAL SECTION DECICATED TO MATH //
///////////////////////////////////////
/**
 * The Math Library.
 * @class math
 * @type {Object}
 */
globals.math = objects.newList();
var math = globals.math.vars;


// Constants
/**
 * 3.141562...
 * @name math.pi
 * @constant
 * @type number
 * @default 3.141592653589793
 */
math.pi = Math.PI
/**
 * Euler's constant
 * @constant
 * @type number
 * @default 2.7182818284590455
 */
math.e = Math.exp(1)

// Numbers
/**
 * Get the square root of a number.
 * @function
 * @param {number} n - The number to square root.
 * @returns {number} sqrt_n - The square root of n.
 */ 
math.sqrt = Math.sqrt
/**
 * Round a number to the nearest integer.
 * @function
 * @param n - The number to round
 * @param e - The power of 10 to round to.
 * @returns i - The rounded number.
 */
math.round = (a,b)=>Math.round(a*10**(b||0))/10**(b||0)
/**
 * Round a number to the next smallest integer.
 * @function
 * @param n - The number to round
 * @param e - The power of 10 to round to.
 * @returns i - The rounded number.
 */
math.floor = (a,b)=>Math.floor(a*10**(b||0))/10**(b||0)
/**
 * Round a number to the next largest integer.
 * @function
 * @param n - The number to round
 * @param e - The power of 10 to round to.
 * @returns i - The rounded number.
 */
math.ceil  = (a,b)=>Math.ceil (a*10**(b||0))/10**(b||0)
/**
 * Given numbers, return the largest.
 * @function
 * @param {...number} n - The numbers to compare.
 * @returns {number} max - The largest of n.
 */
math.max = Math.max
/**
 * Given numbers, return the smallest.
 * @function
 * @param {...number} n - The numbers to compare.
 * @returns {number} max - The smallest of n.
 */
math.min = Math.min
/**
 * Clamp a number between a min and a max.
 * @function
 * @param {number} a - The number to clamp
 * @param {number} b - The minimum
 * @param {number} c - The maximum
 * @returns {number} n - The clamped number.
 */
math.clamp = (a,b,c)=>[a,b,c].sort()[1]
/**
 * Return the log of one or two numbers.
 * @function
 * @param {number} base - The base of the log
 * @param {number} [val] - The value to effect.
 * @returns {number} n - The resulting exponant.
 */
math.log = (a,b)=>typeof(b)=="number"?(Math.log(b)/Math.log(a)):Math.log(a)
/**
 * Get a random value, optionally between two numbers.
 * @function
 * @param {number} [min] - The minimum limit of the random.
 * @param {number} [max] - The maximum limit of the random.
 * @returns {number} val - The random value.
 */
math.random = (a,b)=>typeof(b)=="number"?
				Math.round(Math.random()*(b-a)+a):
					typeof(a)=="number"?
					math.random(1,a):
					Math.random()

// Trig
/** @todo write documentation for Trig functions */
/** @function */
math.sin = a=>Math.sin(a)
/** @function */
math.cos = a=>Math.cos(a)
/** @function */
math.tan = a=>Math.tan(a)
/** @function */
math.asin = a=>Math.asin(a)
/** @function */
math.acos = a=>Math.acos(a)
/** @function */
math.atan = (a,b)=>typeof(b)=="number"?Math.atan2(a,b):Math.atan(a)
/** @function */
math.deg = a=>a/Math.PI*180
/** @function */
math.rad = a=>a/180*Math.PI

//////////////////
// STRING STUFF //
//////////////////
/**
 * The string library.
 * Strings also use this as a parent.
 * @class string
 */
globals.string = objects.newList();
var string = globals.string.vars;

// Format
/**
 * Use a string as a template for a bunch of other strings.
 * @function
 * @param {string} format - The format template to use.
 * @param {...*} arguments - Objects to apply to the template.
 * @returns {string} formatted - The formatted string.
 */
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
/**
 * @function
 * @param {string} string - The string to repeat
 * @param {number} count - The amount of times to repeat the string.
 * @return {string} repeated - The string repeated.
 */
string.rep = (s,n)=>s.repeat(Math.max(n,0))
/** @todo document these functions (My laziness knows no bounds) */
/** @function */
string.reverse = s=>s.split("").reverse().join("")
string.lower = s=>s.toLowerCase()
/** @function */
string.upper = s=>s.toUpperCase()
/** @function */
string.sub = (s,a,b)=> s.substring(a,b)

// Character Code Stuff
/** @function */
string.byte = s=>s.charCodeAt(0)
/** @function */
string.char = s=>String.fromCharCode(s)

// Regex stuff
/**
 * Replace all instances of needle in haystack with replace. Replace may be a function.
 * @function
 * @param {string} haystack - The string to search through.
 * @param {string} needle - The regex to match.
 * @param {string|function} replace - The value to replace with. If a function, passes a match object and uses its return value.
 * @returns {string} replaced - The new modified string.
 */
string.gsub = (a,b,c)=>a.replace(new RegExp(b,'g'),c)
/**
 * Determine if a needle matches a haystack, and if it does, return a match object.
 * @function
 * @param {string} hastack - The string to search through.
 * @param {string} needle - The regex to match.
 * @returns {object} matchobject - An object containing the match information or undefined.
 */
string.match = (a,b)=>objects.ListFromObject(a.match(new RegExp(b)))
/**
 * Build an iterator from a needle and haystack. Each iteration returns the next match.
 * @function
 * @param {string} hastack - The string to search through.
 * @param {string} needle - The regex to match.
 * @returns {function} iterator - The iterator function.
 */
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
/**
 * The IO library. Gets inputs, makes outputs.
 * @class io
 */
globals.io = objects.newList();
var io = globals.io.vars

/**
 * @function
 * @see write
 */
io.write = function(){
	var a = [];
	for(var i=0; i < arguments.length; i++)
		a[i] = globals.toString(arguments[i]);
	process.stdout.write(a.join(""))
	return a[0];
}
/**
 * Read a line from STDIN
 * @function
 * @returns {string} line - The next line of STDIN.
 */
io.read = function(method){
	return stdin.read_line();
}

/////////////////
// TABLE STUFF //
/////////////////
/**
 * The Table library. Objects are defautly parented to this.
 * @class table
 */
globals.table = objects.newList();
var table = globals.table.vars

/**
 * Get the value of an object, ignoring metamethods and similar.
 * @function
 * @param {Object} table - The object to look in.
 * @param {string} key - The key to use.
 * @returns {*} value - The value of table[key].
 */
table.rawGet = function(t, name){
	return t.vars[name];
}
/**
 * Set the key of an object to a value, ingoring metamethods and events.
 * @function
 * @param {Object} table - The object to modify
 * @param {string} key - The key to use.
 * @param {*} value - The value to set table[key] to.
 * @returns {*} value - The new value.
 */
table.rawSet = function(t, name, val){
	return t.vars[name] = val;
}
/**
 * Use a table as the arguments to a function.
 * @function
 * @param {Object} table - The object to use.
 * @param {function} func - The function to apply to.
 * @returns {*} val - The return value of the function call.
 */
table.apply = function(t, fn){
	var asList = [];
	for(var s in t.vars){
		asList[s] = t.vars[s]
	}
	return fn.apply(undefined, asList)
}
/**
 * Return an object with all numbered keys in reversed order to the input.
 * @function
 * @param {Object} table - The object to reverse.
 * @returns {Object} reversed - The reversed object.
 */
table.reverse = function(t){
	var len = globals.math.vars.len
	var inplen = len(t)
	var out = objects.newList()
	for(var i=inplen-1; i>=0; i--){
		out.vars[len(out)] = t.vars[i]
	}
	return out
}
/**
 * Insert a value into a table.
 * @function
 * @param {Object} table - The table to modify.
 * @param {number} [index] - Where to insert the new value. Defaults to the end of the table.
 * @param {*} val - The value to insert.
 * @returns {Object} table - The modified input table.
 */
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
/** 
 * @function
 * @see table.insert
 */
table.push = table.insert
/**
 * Remove a value from an object at a particular index, moving entires after it to fit.
 * @function
 * @param {Object} table - The object to modify.
 * @param {number} [index] - The index of the table to remove. Defaults to the last value of the table.
 * @returns {*} popped - The value removed from the table.
 */
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
/**
 * @function
 * @see table.remove
 */
table.pop = table.remove

/**
 * Get the size of an object.
 * @function
 */
table.len = t=>math.len(t)
/**
 * Rotate an object, preserves all elements.
 * @function
 * @param {Object} table - The object to rotate.
 * @param {number} [n=1] - The amount to rotate. May be negative, defaults to 1.
 * @returns {Object} table - The now modified input table.
 */
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

/**
 * Append a table to the end of another.
 * Non-objects will be implicitly wrapped in an object.
 * @function
 * @param {Object|*} target - The object to append elements to.
 * @param {Object|*} source - The object in which to get elements from.
 * @returns {Object} combined - All of target's elements, followed by source's elements. Modifies target.
 */
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

/**
 * Replace all elements of target with elements of source where source has elements.
 * @function
 * @param {Object} target - The target object.
 * @param {Object} source - Where to copy elements from.
 * @returns {Object} target - The now modified input.
 */
table.merge = function(t,b){
	for(var name in b.vars){
		t.vars[name] = b.vars[name]
	}
	return t;
}

/** @function */
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

/**
 * Create a clone of an object, applying a function to all entries.
 * @function
 * @param {Object} table - The table to clone
 * @param {function} mapping - The function to map over.
 * @returns {Object} modified - The mapped table.
 */
table.map = function(t, fun){
	var newT = objects.newList();
	for(var name in t.vars){
		newT.vars[name] = fun(t.vars[name], name)
	}
	return newT
}

/** @function */
table.sublist = function(t,ind,len){
	ind = ind || 0;
	len = len || math.len(t)-ind;
	var outList = objects.newList();
	var c = 0;
	for(var i=ind; i<(ind+len); i++){
		outList.vars[c++] = t.vars[i];
	}
	return outList;
}

/** @function */
table.sort = function(t,f){
	var t_len = math.len(t);
	var pivot = Math.floor(Math.random()*t_len)
	var pivotVal = t.vars[pivot];
	var left = objects.newList();
	var right = objects.newList();
	var l_i = 0;
	var r_i = 0;
	f = f || math.lt;
	for(var i=0; i<t_len; i++){
		if(i!=pivot){
			if(f(t.vars[i], pivotVal)){
				left.vars[l_i++] = t.vars[i];
			}else{
				right.vars[r_i++] = t.vars[i];
			}
		}
	}
	if(l_i>1)
		left = table.sort(left, f);
	if(r_i>1)
		right = table.sort(right, f);
	return table.add(table.add(left, pivotVal),right)
}

/** @function */
table.reduce = function(t, f){
	var o = t.vars[0]
	var tl = math.len(t);
	for(var i=1; i<tl; i++){
		o = f(o, t.vars[i])
	}
	return o;
}

/** @function */
table.fold = function(t, f){
	var o = objects.newList();
	var tl = math.len(t);
	for(var i=1; i<tl; i++){
		o.vars[i-1] = f(t.vars[i-1], t.vars[i])
	}
	return o;
}

/** @function */
table.cumulate = function(t, f){
	var o = objects.newList();
	var v = t.vars[0];
	o.vars[0] = v;
	var tl = math.len(t);
	for(var i=1; i<tl; i++){
		v = f(v, t.vars[i])
		o.vars[i] = v;
	}
	return o;
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
globalsScope.readOnly = true;

globals._G = globalsScope;

module.exports = globalsScope;