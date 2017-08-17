const objects = {};

objects.newScope = function(parent){
	var n = {};
	n.vars = {};
	n.parent = parent;
	n.getVar = function(name){
		if(!n.parent || n.vars[name]!==undefined)
			return n.vars[name]
		if(n.parent)
			return n.parent.getVar(name);
	}
	n.setVar = function(name, val){
		if(!n.parent || n.vars[name]!==undefined)
			return n.vars[name]=val
		if(n.parent)
			return n.parent.setVar(name, val);
	}
	return n;
}

objects.newList = function(contents){
	var l = {};
	l.vars = {};
	l.getVar = function(name){
		// Parent behavoir isn't default, but it _is_ supported.
		if(!l.parent || l.vars[name]!==undefined)
			return l.vars[name]
		if(l.parent)
			return l.parent.getVar(name);
	}
	l.setVar = function(name, val){
		if(!l.parent || l.vars[name]!==undefined)
			return l.vars[name]=val
		if(l.parent)
			return l.parent.setVar(name, val);
	}
	if(contents)
		for(var i=0; i < contents.length; i++)
			l.vars[i] = contents[i];

	l.toString = function(){
		if(l.vars.asString){
			if(typeof l.vars.asString == "function")
				return l.vars.asString()
			if(typeof l.vars.asString == "string" || typeof l.vars.asString == "number")
				return l.vars.asString
		}
		return JSON.stringify(l.vars)
	}

	return l;
}

module.exports = objects;