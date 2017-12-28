const objects = {};
var globals;

/**
 * An internal object type. Used for variable scopes.
 * @class
 * @name Scope
 * @extends Object
 */
objects.newScope = function(parent,isGlobal){
	var n = Object.create(null,{});
	n.vars = Object.create(null,{});
	n.defined = Object.create(null,{});
	n.parent = parent;
	n.listeners = [];
	n.getVar = function(name){
		if(n.vars[name]!==undefined||n.defined[name])
			return n.vars[name]
		else if(!n.parent){
			var m = objects.getMetaFunc(n, "_index");
			if(m){
				if(typeof m == "function")
					return m(n, name);
				else
					return m.getVar(name)
			}
		}

		if(n.parent)
			return n.parent.getVar(name);
		return n.vars[name];
	}
	n.setVar = function(name, val, force){
		if(force)
			n.defined[name]=true;
		if(n.parent && !n.parent.readOnly && n.vars[name]===undefined && !n.defined[name])
			return n.parent.setVar(name, val)
		var m = objects.getMetaFunc(n, "_newindex");
		if(m){
			var out = m(n, name, val)
			n.listeners.forEach(x=>x());
			return out;
		}
		n.vars[name]=val
		n.listeners.forEach(x=>x());
		return n.vars[name];
	}
	n.getScope = function(name){
		if(!n.parent || n.vars[name]!==undefined)
			return n
		if(n.parent)
			return n.parent.getScope(name);
	}

	n.toString = function(){
		var m = objects.getMetaFunc(n, "_toString")
		if(m){
			if(typeof(m)=="function"){
				return m(n)
			}else{
				return m
			}
		}
		if(n.vars.asString){
			if(typeof n.vars.asString == "function")
				return n.vars.asString()
			if(typeof n.vars.asString == "string" || typeof n.vars.asString == "number")
				return n.vars.asString
		}
		var s = "{";
		var sep = "";
		for(key in n.vars){
			s += sep + globals.vars.toString(key) + "="+(globals.vars.toString(n.vars[key]))
			sep = ","
		}
		return s + "}"
	}

	if(isGlobal)	// This is bad practice. Never do this again.
		globals = n;
	return n;
}

objects.ListFromObject = function(obj){
	if(typeof(obj)=="object" && obj!=null && !obj.vars){
		var l = objects.newList();
		for(var name in obj){
			l.vars[name] = objects.ListFromObject(obj[name])
		}
		return l
	}else{
		return obj
	}
}

/**
 * A bunch of variables in a neat container.
 * @class
 * @name Object
 * @see table
 */
objects.newList = function(contents){
	var l = Object.create(null,{});
	l.vars = Object.create(null,{});
	l.listeners = [];
	l.defined = {}; // Redundancy for scope stuff.
	l.getVar = function(name){
		// Parent behavoir isn't default, but it _is_ supported.
		if(l.vars[name]!==undefined)
			return l.vars[name]
		else if(!l.parent){
			var m = objects.getMetaFunc(l, "_index");
			if(m && m!=l){
				if(typeof m == "function")
					return m(l, name);
				else
					return m.getVar(name)
			}
		}

		if(l.parent)
			return l.parent.getVar(name);
		return l.vars[name];
	}
	l.setVar = function(name, val){
		if(l.parent && l.vars[name]===undefined)
			return l.parent.setVar(name, val)
		var m = objects.getMetaFunc(l, "_newindex");
		if(m){
			var out = m(l, name, val)
			l.listeners.forEach(x=>x());
			return out;
		}
		l.vars[name]=val
		l.listeners.forEach(x=>x());
		return l.vars[name];
	}
	l.getScope = function(name){
		return l;
	}
	if(contents)
		for(var i=0; i < contents.length; i++)
			l.vars[i] = contents[i];

	l.toString = function(){
		var m = objects.getMetaFunc(l, "_toString")
		if(m){
			if(typeof(m)=="function"){
				return m(l)
			}else{
				return m
			}
		}
		if(l.vars.asString){
			if(typeof l.vars.asString == "function")
				return l.vars.asString()
			if(typeof l.vars.asString == "string" || typeof l.vars.asString == "number")
				return l.vars.asString
		}
		var s = "{";
		var sep = "";
		for(key in l.vars){
			s += sep + globals.vars.toString(key) + "="+(globals.vars.toString(l.vars[key]))
			sep = ","
		}
		return s + "}"
	}

	return l;
}
var storedEvents = [];
/**
 * An event which can be called or hooked into.
 * @class
 * @name Event
 * @extends Object
 */
objects.newEvent = function(scope){
	var t = objects.newList();
	t.scope = scope || objects.newScope();
	t.hooked = [];
	t.type = 'Event'
	t.vars.hook = function(func){
		t.hooked.push(func)
	}
	t.vars.call = function(){
		for(var i=0; i < t.hooked.length; i++){
			t.hooked[i](...arguments);
		}
	}
	t.vars.destroy = function(){
		t.hooked = [];
	}

	t.vars._meta = objects.newList()
	t.vars._meta.vars._call = function(a,...b){
		return a.vars.call(...b);
	}
	t.vars._meta.vars._bitor = (a, b)=>{
		var bothEvents = objects.newEvent();
		a.vars.hook(function(...c){
			bothEvents.vars.call(...c)
		})
		b.vars.hook(function(...c){
			bothEvents.vars.call(...c)
		})
		return bothEvents
	}
	storedEvents.push(t);
	return t;
}

function streamableInterface(obj){
	// Requires:
	// obj.vars
	//	 	   write
	//		   on
	//		     data
	//			 close
	//		   end
	// Provides:
	// obj
	//	  type
	//	  vars
	// 		  pipe

	obj.type = "Stream";
	obj.vars.pipe = function(other){
		var output = other;
		if(globals.vars.type(other) == 'string'){
			if(globals.vars.os && globals.vars.os.vars.execute){
				other = globals.vars.os.vars.execute(other);
			}
		}
		if(globals.vars.type(other) == 'Process'){
			output = other.vars.stdout;
			other = other.vars.stdin;
		}
		if(globals.vars.type(other)!='Stream'){
			other = objects.newStream(other);
			output = other;
		}
		obj.vars.on('data', s=>other.vars.write(s));
		obj.vars.on('close', ()=>other.vars.end());
		return objects.newStream(obj, output);
	}
	return obj;
}

/**
 * A stream which can be piped to other streamables or functions.
 * @class
 * @name Stream
 * @extends Object
 */
objects.newStream = function(obj,partner){
	var stream = objects.newList();
	stream.vars.on = ()=>{};
	stream.vars.write = ()=>{};
	stream.vars.end = ()=>{};
	obj = obj || (s=>s);
	if(globals.vars.type(obj) != "Stream"){
		if(typeof obj == 'function'){
			stream.hooks = {data: [], close: []};
			stream.closed = false;
			stream.func = obj;
			stream.vars.on = function(d, func){
				var evnt = objects.newEvent();
				stream.hooks[d] = stream.hooks[d]||[];
				if(func){
					stream.hooks[d].push(func);
				}
				stream.hooks[d].push(evnt.vars.call)
				return evnt;
			}
			stream.vars.write = function(...s){
				if(!stream.closed){
					var ret = stream.func(...s);
					for(var i=0; i < stream.hooks.data.length; i++){
						stream.hooks.data[i](ret);
					}
					return true;
				}
				return false;
			}
			stream.vars.end = function(code){
				if(!stream.closed){
					for(var i=0; i < stream.hooks.close.length; i++){
						stream.hooks.close[i](code);
					}
					stream.closed = true;
					return true;
				}
				return false;
			}
		}else if(obj.on){
			stream.obj = obj;
			stream.vars.on = function(d, prehook){
				var evnt = objects.newEvent();
				stream.obj.on(d, s=>{
					if (Buffer.isBuffer(s)){
						evnt.vars.call(s.toString())
					}else{
						evnt.vars.call(s)
					}
				});
				if(prehook){
					evnt.vars.hook(prehook);
				}
				return evnt;
			}
			stream.vars.write = function(s){
				try{stream.obj.write(s);}catch(e){}
				return stream;
			}
			stream.vars.end = function(s){
				try{stream.obj.end(s);}catch(e){}
				return stream;
			}
		}
		obj = streamableInterface(stream);
	}

	if(partner && globals.vars.type(partner) == "Stream"){
		var newObj = objects.newList();
		newObj.vars.on = partner.vars.on;
		newObj.vars.write = obj.vars.write;
		newObj.vars.end = obj.vars.end;
		return streamableInterface(newObj);
	}
	return obj;
}

objects.destroyEvents = ()=>{
	for(var i=0; i < storedEvents.length; i++){
		storedEvents[i].hooked = [];
	}
	storedEvents = [];
}

Function.prototype.toString = function(){
	var m = objects.getMetaFunc(this, "_toString")
	if(m){
		if(typeof(m)=="function"){
			return m(this)
		}else{
			return m
		}
	}
	return this.stringify || "[internal function]"
};

module.exports = objects;