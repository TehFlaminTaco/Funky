const parse = module.exports;
const objects = require("./objects.js");
const globals = require("./globalScope.js");
const tokenizer = require("./tokenizer.js");

// PARSER FUNCTIONS
// PASS IT A TOKEN, EG: {name: 'expression', data: [...]}
// IT'LL PASS BACK THE VALUE OF IT.
parse.Expression = function(exp, scope){
	if(!scope)
		throw new Error("Scope dropped!");
	exp = exp.data[0].items[0];
	var typ = exp.name;
	if(typ == "assignment")
		return parse.Assignment(exp,scope)
	if(typ == "constant")
		return parse.Constant(exp,scope)
	if(typ == "var"){
		var v = parse.Var(exp, scope);
		return v ? v.getter() : undefined;
	}
	if(typ == "call")
		return parse.Call(exp,scope)
	if(typ == "unaryarithmatic")
		return parse.UnaryArithmatic(exp, scope);
	if(typ == "arithmatic")
		return parse.Arithmatic(exp, scope);
	if(typ == "deop")
		return parse.Deop(exp, scope);
	if(typ == "function_builder")
		return parse.Function(exp, scope);
	if(typ == "paranexp")
		return parse.Expression(exp.data[1].items[0], scope);
	if(typ == "forloop")
		return parse.ForLoop(exp, scope);
	if(typ == "ifblock")
		return parse.IfBlock(exp, scope);
	if(typ == "ternary")
		return parse.Ternary(exp, scope);
	if(typ == "whileblock")
		return parse.WhileBlock(exp, scope);
	if(typ == "whenblock")
		return parse.WhenBlock(exp, scope);
	if(typ == "crementor")
		return parse.Crementor(exp, scope);
	if(typ == "is")
		return parse.IsEvent(exp, scope);
	if(typ == "eval"){
		return parse.Eval(exp, scope);
	}
	throw new Error("Unknown expression type: "+typ)
}

parse.Assignment = function(assign, scope, expscope){
	var dat = assign.data;
	var v = parse.Var(dat[0].items[0], scope);
	var val = parse.Expression(dat[3].items[0], expscope || scope);
	if(v){
		if(dat[1].count){
			var op = dat[1].items[0].data[0].items[0].name
			val = parse.Operator(op, v.getter(), val);
		}
		v.setter(val);
	}
	return val;
}

parse.Operator = function(name, l, r){
	var func = globals.vars.math.getVar(name);
	if(!func)
		throw new Error("Unknown operator: "+name)
	if(globals.vars.getMetaFunc(l, "_"+name)){
		var v = globals.vars.getMetaFunc(l, "_"+name)(l, r)
		return v===undefined ? func(l,r) : v
	}
	if(globals.vars.getMetaFunc(r, "_"+name)){
		var v = globals.vars.getMetaFunc(r, "_"+name)(l, r)
		return v===undefined ? func(l,r) : v
	}
	return func(l, r);
}

parse.Arithmatic = function(arith, scope){
	var name = arith.data[1].items[0].data[0].name;
	if(name == "and"){
		var l = parse.Expression(arith.data[0].items[0], scope);
		if(l){
			return parse.Expression(arith.data[2].items[0], scope);
		}else{
			return l
		}
	}
	if(name == "or"){
		var l = parse.Expression(arith.data[0].items[0], scope);
		if(l){
			return l
		}else{
			return parse.Expression(arith.data[2].items[0], scope);
		}
	}
	var l = arith.data[0].items[0];
	var r = arith.data[2].items[0];
	l = parse.Expression(l, scope);
	r = parse.Expression(r, scope);
	return parse.Operator(name, l, r)
}

globals.vars.math.vars.add = (a,b)=>a+b;
globals.vars.math.vars.sub = (a,b)=>a-b;
globals.vars.math.vars.mult = (a,b)=>a*b;
globals.vars.math.vars.div = (a,b)=>a/b;
globals.vars.math.vars.intdiv = (a,b)=>Math.floor(a/b);
globals.vars.math.vars.pow = (a,b)=>a**b;
globals.vars.math.vars.mod = (a,b)=>a%b;
globals.vars.math.vars.and = (a,b)=>a&&b;
globals.vars.math.vars.or = (a,b)=>a||b;
globals.vars.math.vars.concat = (a,b)=>globals.vars.toString(a)+globals.vars.toString(b)
globals.vars.math.vars.bitor = (a,b)=>a|b;
globals.vars.math.vars.bitand = (a,b)=>a&b;
globals.vars.math.vars.bitxor = (a,b)=>a^b;
globals.vars.math.vars.bitshiftl = (a,b)=>a<<b;
globals.vars.math.vars.bitshiftr = (a,b)=>a>>b;
globals.vars.math.vars.le = (a,b)=>a<=b;
globals.vars.math.vars.lt = (a,b)=>a<b;
globals.vars.math.vars.ge = (a,b)=>a>=b;
globals.vars.math.vars.gt = (a,b)=>a>b;
globals.vars.math.vars.eq = (a,b)=>a==b;
globals.vars.math.vars.ne = (a,b)=>a!=b;

parse.UnaryArithmatic = function(arith, scope){
	var l = arith.data[1].items[0];
	l = parse.Expression(l, scope);
	var func = globals.vars.math.getVar(arith.data[0].items[0].data[0].name)
	if(!func)
		throw new Error("Unknown operator: "+arith.data[0].items[0].data[0].name)
	if(globals.vars.getMetaFunc(l, "_"+arith.data[1].items[0].data[0].name)){
		var v = globals.vars.getMetaFunc(l, "_"+arith.data[1].items[0].data[0].name)(l)
		return v===undefined ? func(l) : v
	}
	return func(l);
}
globals.vars.math.vars.not = a=>!a;
globals.vars.math.vars.len = a=>{
	if(typeof a == "string")
		return a.length;
	if(typeof a == "object"){
		if(a.vars){
			var max = -1;
			for(var name in a.vars){
				if(typeof(Number(name))=="number")
					max = Math.max(name, max)
			}
			return max+1
		}else{
			return a.length
		}
	}
	return a;
}
globals.vars.math.vars.bitnot = a=>~a;

parse.Constant = function(cons, scope){
	cons = cons.data[0].items[0];
	var constyp = cons.name;
	if(constyp == "numberconstant")
		return Number(cons.data[0].items[0]);
	if(constyp == "stringconstant")
		return eval(cons.data[0].items[0]);
	if(constyp == "tableconstant"){
		var t = objects.newList();
		var toAppend = cons.data[1].items;
		var curIndex = 0;
		for(var i=0; i < toAppend.length; i++){
			var this_entry = toAppend[i];
			if(this_entry.data[0].items[0].name == "expression"){
				t.vars[curIndex++] = parse.Expression(this_entry.data[0].items[0], scope)
			}else{
				var val = parse.Expression(this_entry.data[2].items[0], scope)
				var name_tokn = this_entry.data[0].items[0]
				var name
				if(name_tokn.name == "constant"){
					name = parse.Constant(name_tokn)
				}else{
					name = name_tokn.data[1].items[0]
				}
				t.vars[name] = val
			}
		}
		return t;
	}
	throw new Error("Unknown constant type: "+constyp)
}

parse.Var = function(v, scope){
	var dat = v;
	if(dat.name == "expression"){ // Generic fix for me fully reworking the tokenizer.
		dat = dat.data[0].items[0]
	}
	var t = dat.data[0].name;
	if(t == "local"){
		var useLocal = !!dat.data[0].count;
		var name = dat.data[1].items[0];
		if(useLocal)
			return {
				scope: scope,
				getter: function(){
					return scope.vars[name];
				},
				setter: function(val){
					scope.defined[name] = true;
					scope.vars[name] = val;
					return val;
				}
			}
		return {
			scope: scope.getScope(name),
			getter: function(){
				return scope.getVar(name);
			},
			setter: function(val){
				scope.setVar(name, val);
				return val;
			}
		}
	}
	// Otherwise, we've got an _expression_
	var rootTab = parse.Expression(dat.data[0].items[0], scope);
	var ind = dat.data[1].items[0];
	var name;
	var curry = false;
	if(ind.data[0].name == "\\."){
		name = ind.data[1].items[0]
	}else if(ind.data[0].name == "::"){
		name = ind.data[1].items[0]
		curry = true;
	}else{
		name = parse.Expression(ind.data[1].items[0], scope)
	}
	if(rootTab){
		var m = objects.getMetaFunc()
		if(typeof rootTab != "object" || !rootTab.vars)
			return {
				scope: rootTab,
				getter: function(){
					var v;
					if(rootTab.hasOwnProperty(name)){
						v = rootTab[name];
					}
					if(v==undefined){
						var m = objects.getMetaFunc(rootTab, "_index")
						if(m){
							if(typeof(m)=="function"){
								v = m(rootTab, name)
							}else{
								v = m.getVar(name)
							}
						}
					}
					if(curry){
						return function(){
							return v(rootTab, ...arguments)
						}
					}
					return v;
				},
				setter: function(val){
					rootTab[name] = val;
				}
			}
		else
			return {
				scope: rootTab,
				getter: function(){
					var v = rootTab.getVar(name);
					if(curry){
						return function(){
							var argsAsList = [];
							for(var argn in arguments){
								argsAsList[argn] = arguments[argn];
							}
							return v.apply(rootTab, [rootTab].concat(argsAsList))
						}
					}
					return v;
				},
				setter: function(val){
					rootTab.setVar(name, val);
				}
			}
	}
}

parse.Function = function(func, scope){
	var arglistScope = objects.newScope();
	var expScope = objects.newScope(scope);
	var inp_func = func;
	var func;
	// Shorthand function. Rather consistent form.
	if(func.data[0].name == "var" || func.data[0].name == "arg_list"){
		var vList = [];
		if(func.data[0].name == "var"){
			vList[0] = parse.Var(func.data[0].items[0], arglistScope);
		}else{
			var argFill = func.data[0].items[0].data[1].items
			for(var i=0; i < argFill.length; i++){
				var sub_v = argFill[i].data[0].items[0];
				var sub_v_parsed;
				if(sub_v.name == "var"){
					sub_v_parsed = parse.Var(sub_v, arglistScope);
				}else{
					parse.Assignment(sub_v, arglistScope, expScope);
					sub_v_parsed = parse.Var(sub_v.data[0].items[0], arglistScope);
				}
				vList.push(sub_v_parsed);
			}
		}
		var toDo = func.data[2].items[0].data[0].items[0];
		//console.log(toDo);
		func = function(){
			var tmpScope = objects.newScope(expScope);
			var curArguments = (func.scope || tmpScope).vars.arguments;
			(func.scope || tmpScope).vars.arguments = objects.newList()
			for(var i=0; i < arguments.length; i++){
				(func.scope || tmpScope).vars.arguments.vars[i] = arguments[i]
				if(vList[i])
					vList[i].setter(arguments[i])
			}
			for(var i=arguments.length+1; i<vList.length; i++){
				vList[i].setter(undefined)
			}
			for(var name in arglistScope.vars){
				tmpScope.vars[name] = arglistScope.vars[name]
				tmpScope.defined[name] = true;
			}
			if(toDo.name == "block"){
				var out = parse.Program(toDo, func.scope || tmpScope);
				(func.scope || tmpScope).vars.arguments = curArguments
				return out
			}else{
				var out = parse.Expression(toDo, func.scope || tmpScope);
				(func.scope || tmpScope).vars.arguments = curArguments
				return out
			}
		}
		func.stringify = inp_func.text;
		return func;

	// Longhand function, inconsistent form.
	}else{
		var action;
		var vList = [];
		var named = false;
		var name = false;
		// A potentially named function.
		if(func.data[2].name == "arg_list"){
			named = !!func.data[1].count;

			var argFill = func.data[2].items[0].data[1].items;
			for(var i=0; i < argFill.length; i++){
				var sub_v = argFill[i].data[0].items[0];
				var sub_v_parsed;
				if(sub_v.name == "var"){
					sub_v_parsed = parse.Var(sub_v, arglistScope);
				}else{
					parse.Assignment(sub_v, arglistScope, expScope);
					sub_v_parsed = parse.Var(sub_v.data[0].items[0], arglistScope);
				}
				vList.push(sub_v_parsed);
			}

			if(named)
				name = parse.Var(func.data[1].items[0], scope)

			action = func.data[3].items[0];

		// Always an Anon function.
		}else{
			vList[0] = parse.Var(func.data[1].items[0], arglistScope)
			action = func.data[2].items[0];
		}
		
		var toDo = action.data[0].items[0];
		func = function(){
			var tmpScope = objects.newScope(expScope);
			var curArguments = (func.scope || tmpScope).vars.arguments;
			(func.scope || tmpScope).vars.arguments = objects.newList()
			for(var i=0; i < arguments.length; i++){
				(func.scope || tmpScope).vars.arguments.vars[i] = arguments[i]
				if(vList[i])
					vList[i].setter(arguments[i])
			}
			for(var i=arguments.length; i<vList.length; i++){
				vList[i].setter(undefined)
			}
			for(var name in arglistScope.vars){
				tmpScope.vars[name] = arglistScope.vars[name]
				tmpScope.defined[name] = true;
			}
			if(toDo.name == "block"){
				var out = parse.Program(toDo, func.scope || tmpScope);
				(func.scope || tmpScope).vars.arguments = curArguments
				return out
			}else{
				var out = parse.Expression(toDo, func.scope || tmpScope);
				(func.scope || tmpScope).vars.arguments = curArguments
				return out
			}
		}
		func.stringify = inp_func.text;
		if(named){
			name.setter(func);
		}
		return func
	}
}

parse.WhenBlock = function(when, scope){
	var evnt = parse.Expression(when.data[1].items[0], scope);
	var todo = ()=>{
		var nScope = objects.newScope(scope);
		parse.ExpBlock(when.data[2].items[0], nScope);
	}
	evnt.vars.hook(todo);
}

parse.IsEvent = function(is, scope){
	var v = parse.Var(is.data[0].items[0], scope);
	var evnt = objects.newEvent();
	if(v.scope)
		v.scope.listeners.push(()=>{
			if(is.data[2].name == '\\*' || v.getter() == parse.Expression(is.data[2].items[0], scope)){
				evnt.vars.call();
			}
		})
	return evnt;
}

parse.Deop = function(expBlock, scope){
	var op = expBlock.data[1].items[0].data[0].items[0].name;
	func = (a,b)=>parse.Operator(op,a,b);
	func.stringify = expBlock.text;
	return func;
}

parse.ExpBlock = function(expBlock, scope){
	if(expBlock.data[0].name == "block"){
		return parse.Program(expBlock.data[0].items[0], scope)
	}else{
		return parse.Expression(expBlock.data[0].items[0], scope)
	}
}

parse.ForLoop = function(forloop, scope){
	var subScope = objects.newScope(scope);
	var usingIn = forloop.data[2].name == "in";
	var lastOut;
	if(usingIn){
		var v = parse.Var(forloop.data[1].items[0], subScope);
		var iter = parse.Expression(forloop.data[3].items[0], subScope);
		if(typeof iter == "object"){
			for (name in iter.vars){
				v.setter(name);
				lastOut = parse.ExpBlock(forloop.data[4].items[0], scope);
			}
			return lastOut
		}
		if(typeof iter != "function")
			return;
		var val;

		while((val = iter(val))!=undefined){
			v.setter(val);
			lastOut = parse.ExpBlock(forloop.data[4].items[0], scope);
		}
		return lastOut;
	}else{
		var exprs = forloop.data[2].items;
		var todo = forloop.data[4].items[0];
		if(exprs.length >= 1)
			parse.Expression(exprs[0].data[0].items[0], subScope);
		while(exprs.length >= 2?parse.Expression(exprs[1].data[0].items[0], subScope):true){
			lastOut = parse.ExpBlock(todo, subScope);

			if(exprs.length >= 3)
				parse.Expression(exprs[2].data[0].items[0], subScope);
		}
	}
	return lastOut;
}

parse.Eval = function(evl, scope){
	var str = parse.Expression(evl.data[1].items[0], scope);
	var chnk = tokenizer.compile(str);
	var fnk = function(){
		var midScope = objects.newScope(scope);
		midScope.vars.arguments = objects.ListFromObject(arguments)
		return parse.Program(chnk, midScope);
	}

	fnk.stringify = evl.text;
	return fnk;
}

parse.IfBlock = function(ifb, scope){
	var subScope = objects.newScope(scope);
	var exp = ifb.data[1].items[0];
	var todo = ifb.data[2].items[0];
	if(parse.Expression(exp, subScope)){
		return parse.ExpBlock(todo, scope);
	}else{
		if(ifb.data[3].count > 0){
			todo = ifb.data[3].items[0].data[1].items[0];
			return parse.ExpBlock(todo, subScope);
		}
	}
}

parse.Ternary = function(ternary, scope){
	if(parse.Expression(ternary.data[0].items[0], scope)){
		return parse.Expression(ternary.data[2].items[0], scope);
	}else{
		if(ternary.data[3].count>0){
			return parse.Expression(ternary.data[3].items[0].data[1].items[0], scope);
		}
	}
}

parse.WhileBlock = function(ifb, scope){
	var subScope = objects.newScope(scope);
	var exp = ifb.data[1].items[0];
	var todo = ifb.data[2].items[0];
	while(parse.Expression(exp, subScope)){
		parse.ExpBlock(todo, scope);
	}
}

parse.Crementor = function(cre, scope){
	var v;
	var t;
	if(cre.data[0].name == "expression"){
		v = parse.Var(cre.data[0].items[0].data[0].items[0], scope);
		t = cre.data[1].name=='\\+\\+' ? 1 : -1;
		var curVal = v.getter();
		if(curVal == undefined)
			curVal = 0;
		v.setter(curVal+t);
		return curVal;
	}else{
		v = parse.Var(cre.data[1].items[0].data[0].items[0], scope);
		t = cre.data[0].name=='\\+\\+' ? 1 : -1;
		var curVal = v.getter();
		if(curVal == undefined)
			curVal = 0;
		v.setter(curVal+t);
		return v.getter();
	}
}

parse.Call = function(call, scope){
	var toCall = parse.Expression(call.data[0].items[0], scope);
	if(call.data[2]){
		var args = call.data[2].items;
		var parsedArgs = [];
		for(var i=0; i < args.length; i++){
			var val = parse.Expression(args[i].data[0].items[0], scope);
			parsedArgs.push(val);
		}
		if(typeof globals.vars.getMetaFunc(toCall, "_call") == "function"){
			return globals.vars.getMetaFunc(toCall, "_call").apply(toCall, [toCall].concat(parsedArgs));
		}
		if(typeof toCall == "function")
			return toCall.apply(toCall, parsedArgs);
		return toCall;
	}else{
		var parsedArgs = [parse.Constant(call.data[1].items[0], scope)]
		if(typeof globals.vars.getMetaFunc(toCall, "_call") == "function"){
			return globals.vars.getMetaFunc(toCall, "_call").apply(toCall, [toCall].concat(parsedArgs));
		}
		if(typeof toCall == "function")
			return toCall.apply(toCall, parsedArgs);
		return toCall;
	}
}

parse.Program = function(prog, upscope){
	//console.log(JSON.stringify(prog, null, 2))
	var scope = objects.newScope(upscope || globals);
	var expressions = prog.data[0].items;
	if(prog.name == "block"){
		expressions = prog.data[1].items;
	}
	var returnvalue = undefined;
	for(var i=0; i < expressions.length; i++){
		returnvalue = parse.Expression(expressions[i].data[0].items[0], scope);
	}
	return returnvalue;
}