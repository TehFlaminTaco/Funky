const objects = {};

objects.newScope = function(parent){
	var n = {};
	n.vars = {};
	n.parent = parent;
	n.listeners = [];
	n.getVar = function(name){
		if(n.vars[name]!==undefined)
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
	n.setVar = function(name, val){
		if(n.parent && n.vars[name]===undefined)
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
	return n;
}

objects.newList = function(contents){
	var l = {};
	l.vars = {};
	l.listeners = [];
	l.getVar = function(name){
		// Parent behavoir isn't default, but it _is_ supported.
		if(l.vars[name]!==undefined)
			return l.vars[name]
		else if(!l.parent){
			var m = objects.getMetaFunc(l, "_index");
			if(m){
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
			s += sep + key.toString() + "="+l.vars[key].toString()
			sep = ","
		}
		return s + "}"
	}

	return l;
}

objects.newEvent = function(scope){
	var t = objects.newList();
	t.scope = scope || objects.newScope();
	t.hooked = [];
	t.vars.hook = function(func){
		t.hooked.push(func)
	}
	t.vars.call = function(){
		for(var i=0; i < t.hooked.length; i++){
			t.hooked[i]();
		}
	}
	return t;
}

module.exports = objects;