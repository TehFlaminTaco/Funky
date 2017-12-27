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

/**
 * A stream which can be piped to other streamables or functions.
 * @class
 * @name Stream
 * @extends Object
 */
objects.newStream = function(stream_obj){
    if(typeof(stream_obj)=='function'){
        var stream = objects.newList();
        stream.hooks = {data: [], close: []};
        var closed = false;
        stream.vars.write = function(s){
            if (!closed){
                var ret = stream_obj(s);
                for(var i=0; i < stream.hooks.data.length; i++){
                    stream.hooks.data[i](ret);
                }
                return true;
            }
            return false;
        }

        stream.vars.end = function(s){
            closed = true;
            for(var i=0; i < stream.hooks.close.length; i++){
                stream.hooks.close[i]();
            }
            return true;
        }

        stream.vars.on = function(hook, func){
            stream.hooks[hook] = stream.hooks[hook]||[];
            stream.hooks[hook].push(func);
            return stream;
        }

        stream.vars.pipe = function(other){
            if(other == undefined){
                return undefined;
            }else if(other.type == 'Stream'){
                stream.vars.on('data', (s)=>other.vars.write(s))
                stream.vars.on('close', ()=>other.vars.end())
                return other;
            }else if(other.vars && other.vars.stdin && other.vars.stdin.stream_obj){
                stream.vars.on('data', (s)=>other.vars.stdin.vars.write(s))
                stream.vars.on('close', ()=>other.vars.stdin.vars.end())
                return other;
            }else if(typeof other == 'function'){
                other = objects.newStream(other);
                return stream.vars.pipe(other);
            }else{
                stream.vars.on('data', other);
                return stream;
            }
            return other;
        }

        stream.type = 'Stream';
        return stream;
    }else{
        var stream = objects.newList();
        stream.vars.on = function(d, prehook){
            var evnt = objects.newEvent();
            stream_obj.on(d, s=>{
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
            stream_obj.write(s);
        }
        stream.vars.end = function(s){
            stream_obj.end(s);
        }
        stream.vars.pipe = function(other){
            if(other == undefined){
                return undefined;
            }else if(other.stream_obj){
                stream_obj.pipe(other.stream_obj);
            }else if(other.type == 'Stream'){
                stream.vars.on('data', (s)=>other.vars.write(s))
                stream.vars.on('close', ()=>other.vars.end())
                return other;
            }else if(other.vars && other.vars.stdin && other.vars.stdin.stream_obj){
                stream_obj.pipe(other.vars.stdin.stream_obj);
                return other;
            }else if(typeof other == 'function'){
                other = objects.newStream(other);
                return stream.vars.pipe(other);
            }else{
                stream.vars.on('data', other);
                return stream;
            }
            return other;
        }
        stream.stream_obj = stream_obj;

        stream.type = 'Stream';

        return stream;
    }
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