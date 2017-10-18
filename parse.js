const parse = {};
const objects = require("./objects.js");
const globals = require("./globalScope.js");

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

	throw new Error("Unknown expression type: "+typ)
}

parse.Assignment = function(assign, scope, expscope){
	var dat = assign.data;
	var v = parse.Var(dat[0].items[0], scope);
	var val = parse.Expression(dat[2].items[0], expscope || scope);
	if(v)
		v.setter(val);
	return val;
}

parse.Arithmatic = function(arith, scope){
	var l = arith.data[0].items[0];
	var r = arith.data[2].items[0];
	l = parse.Expression(l, scope);
	r = parse.Expression(r, scope);
	var func = globals.vars.math.getVar(arith.data[1].items[0].data[0].name)
	if(!func)
		throw new Error("Unknown operator: "+arith.data[1].items[0].data[0].name)
	if(globals.vars.getMetaFunc(l, "_"+arith.data[1].items[0].data[0].name)){
		var v = globals.vars.getMetaFunc(l, "_"+arith.data[1].items[0].data[0].name)(l, r)
		return v===undefined ? func(l,r) : v
	}
	if(globals.vars.getMetaFunc(r, "_"+arith.data[1].items[0].data[0].name)){
		var v = globals.vars.getMetaFunc(r, "_"+arith.data[1].items[0].data[0].name)(l, r)
		return v===undefined ? func(l,r) : v
	}
	return func(l, r);
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
	if(typeof a == "object")
		return a.vars?a.vars.length:a.length;
	return a;
}
globals.vars.math.vars.bitnot = a=>~a;

parse.Constant = function(cons, scope){
	cons = cons.data[0].items[0];
	var constyp = cons.name;
	if(constyp == "numberconstant")
		return Number(cons.data[0].items[0]);
	if(constyp == "stringconstant")
		return JSON.parse(cons.data[0].items[0]);
	if(constyp == "tableconstant"){
		var t = objects.newList();
		var toAppend = cons.data[1].items;
		var curIndex = 0;
		for(var i=0; i < toAppend.length; i++){
			var this_entry = toAppend[i].data[0].items[0];
			if(this_entry.data[0].name != "assignment"){
				t.vars[curIndex++] = parse.Expression(this_entry, scope)
			}else{
				this_entry = this_entry.data[0].items[0]
				var v = this_entry.data[0].items[0].data[0].items[0];
				var val = parse.Expression(this_entry.data[2].items[0], scope);
				t.vars[v.data[1].items[0]] = val;
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
	if(ind.data[0].name == "\\."){
		name = ind.data[1].items[0]
	}else{
		name = parse.Expression(ind.data[1].items[0], scope)
	}
	if(rootTab){
		if(typeof rootTab != "object" || !rootTab.vars)
			return {
				scope: rootTab,
				getter: function(){
					if(rootTab.hasOwnProperty(name))
						return rootTab[name]
					return undefined
				},
				setter: function(val){
					rootTab[name] = val;
				}
			}
		else
			return {
				scope: rootTab,
				getter: function(){
					return rootTab.getVar(name);
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
	expScope.vars = arglistScope.vars
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
			for(var i=0; i < arguments.length; i++){
				if(vList[i])
					vList[i].setter(arguments[i])
			}
			if(toDo.name == "block"){
				return parse.Program(toDo, func.scope || expScope)
			}else{
				return parse.Expression(toDo, func.scope || expScope);
			}
		}
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
			for(var i=0; i < arguments.length; i++){
				if(vList[i])
					vList[i].setter(arguments[i])
			}
			if(toDo.name == "block"){
				return parse.Program(toDo, func.scope || expScope)
			}else{
				return parse.Expression(toDo, func.scope || expScope);
			}
		}
		if(named){
			name.setter(func);
		}
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

parse.IfBlock = function(ifb, scope){
	var subScope = objects.newScope(scope);
	var exp = ifb.data[1].items[0];
	var todo = ifb.data[2].items[0];
	if(parse.Expression(exp, subScope)){
		return parse.ExpBlock(todo, scope);
	}else{
		if(ifb.data[3].count > 0){
			todo = ifb.data[3].items[0].data[1].items[0];
			if(todo.name == "block"){
				return parse.Program(todo, subScope)
			}else{
				return parse.Expression(todo, subScope);
			}
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
	var args = call.data[2].items;
	var parsedArgs = [];
	for(var i=0; i < args.length; i++){
		var val = parse.Expression(args[i].data[0].items[0], scope);
		parsedArgs.push(val);
	}
	if(typeof globals.vars.getMetaFunc(toCall, "_call") == "function"){
		globals.vars.getMetaFunc(toCall, "_call").apply(toCall, [toCall].concat(parsedArgs));
	}
	if(typeof toCall == "function")
		return toCall.apply(toCall, parsedArgs);
	return toCall;
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

module.exports = parse;