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
	if(typ == "var")
		return parse.Var(exp, scope).getter()
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
	if(typ == "whileblock")
		return parse.WhileBlock(exp, scope);
	if(typ == "crementor")
		return parse.Crementor(exp, scope);

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
	var func = parse.Arithmatic[arith.data[1].items[0].data[0].name]
	if(!func)
		throw new Error("Unknown operator: "+arith.data[1].items[0].data[0].name)
	return func(l, r);
}

parse.Arithmatic.add = (a,b)=>a+b;
parse.Arithmatic.sub = (a,b)=>a-b;
parse.Arithmatic.mult = (a,b)=>a*b;
parse.Arithmatic.div = (a,b)=>a/b;
parse.Arithmatic.intdiv = (a,b)=>Math.floor(a/b);
parse.Arithmatic.pow = (a,b)=>a**b;
parse.Arithmatic.mod = (a,b)=>a%b;
parse.Arithmatic.and = (a,b)=>a&&b;
parse.Arithmatic.or = (a,b)=>a||b;
parse.Arithmatic.bitor = (a,b)=>a|b;
parse.Arithmatic.bitand = (a,b)=>a&b;
parse.Arithmatic.bitxor = (a,b)=>a^b;
parse.Arithmatic.le = (a,b)=>a<=b;
parse.Arithmatic.lt = (a,b)=>a<b;
parse.Arithmatic.ge = (a,b)=>a>=b;
parse.Arithmatic.gt = (a,b)=>a>b;
parse.Arithmatic.eq = (a,b)=>a==b;
parse.Arithmatic.ne = (a,b)=>a!=b;

parse.UnaryArithmatic = function(arith, scope){
	var l = arith.data[1].items[0];
	l = parse.Expression(l, scope);
	var func = parse.Arithmatic[arith.data[0].items[0].data[0].name]
	if(!func)
		throw new Error("Unknown operator: "+arith.data[0].items[0].data[0].name)
	return func(l);
}
parse.Arithmatic.not = a=>!a;
parse.Arithmatic.len = a=>a.length;
parse.Arithmatic.bitnot = a=>~a;

parse.Constant = function(cons, scope){
	cons = cons.data[0].items[0];
	var constyp = cons.name;
	if(constyp == "numberconstant")
		return Number(cons.data[0].items[0]);
	if(constyp == "stringconstant")
		return JSON.parse(cons.data[0].items[0]);
	if(constyp == "tableconstant"){
		var t = objects.newList();
		return t;
	}
	throw new Error("Unknown constant type: "+constyp)
}

parse.Var = function(v, scope){
	var dat = v;
	var t = dat.data[0].name;
	if(t == "local"){
		var useLocal = !!dat.data[0].count;
		var name = dat.data[1].items[0];
		if(useLocal)
			return {
				getter: function(){
					return scope.vars[name];
				},
				setter: function(val){
					scope.vars[name] = val;
					return val;
				}
			}
		return {
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
		if(typeof rootTab == "function")
			return {
				getter: function(){
					return rootTab[name]
				},
				setter: function(val){
					rootTab[name] = val;
				}
			}
		else
			return {
				getter: function(){
					return rootTab.vars[name]
				},
				setter: function(val){
					rootTab.vars[name] = val;
				}
			}
	}
}

parse.Function = function(func, scope){
	var arglistScope = objects.newScope();
	var expScope = objects.newScope(scope);
	expScope.vars = arglistScope.vars
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
		var func = function(){
			for(var i=0; i < arguments.length; i++){
				if(vList[i])
					vList[i].setter(arguments[i])
			}
			if(toDo.name == "block"){
				return parse.Program(toDo, expScope)
			}else{
				return parse.Expression(toDo, expScope);
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
		var func = function(){
			for(var i=0; i < arguments.length; i++){
				if(vList[i])
					vList[i].setter(arguments[i])
			}
			if(toDo.name == "block"){
				return parse.Program(toDo, expScope)
			}else{
				return parse.Expression(toDo, expScope);
			}
		}
		if(named){
			name.setter(func);
		}
	}
}

parse.ForLoop = function(forloop, scope){
	var subScope = objects.newScope(scope);
	var exprs = forloop.data[2].items;
	var todo = forloop.data[4].items[0];
	if(exprs.length >= 1)
		parse.Expression(exprs[0].data[0].items[0], subScope);
	while(exprs.length >= 2?parse.Expression(exprs[1].data[0].items[0], subScope):true){

		if(todo.name == "block"){
			parse.Program(todo, subScope)
		}else{
			parse.Expression(todo, subScope);
		}

		if(exprs.length >= 3)
			parse.Expression(exprs[2].data[0].items[0], subScope);
	}
}

parse.IfBlock = function(ifb, scope){
	var subScope = objects.newScope(scope);
	var exp = ifb.data[1].items[0];
	var todo = ifb.data[2].items[0];
	if(parse.Expression(exp, subScope)){
		if(todo.name == "block"){
			parse.Program(todo, subScope)
		}else{
			parse.Expression(todo, subScope);
		}
	}else{
		if(ifb.data[3].count > 0){
			todo = ifb.data[3].items[0].data[1].items[0];
			if(todo.name == "block"){
				parse.Program(todo, subScope)
			}else{
				parse.Expression(todo, subScope);
			}
		}
	}
}

parse.WhileBlock = function(ifb, scope){
	var subScope = objects.newScope(scope);
	var exp = ifb.data[1].items[0];
	var todo = ifb.data[2].items[0];
	while(parse.Expression(exp, subScope)){
		if(todo.name == "block"){
			parse.Program(todo, subScope)
		}else{
			parse.Expression(todo, subScope);
		}
	}
}

parse.Crementor = function(cre, scope){
	var v;
	var t;
	if(cre.data[0].name == "var"){
		v = parse.Var(cre.data[0].items[0], scope);
		t = cre.data[1].name=='\\+\\+' ? 1 : -1;
		var curVal = v.getter();
		v.setter(curVal+t);
		return curVal;
	}else{
		v = parse.Var(cre.data[1].items[0], scope);
		t = cre.data[0].name=='\\+\\+' ? 1 : -1;
		v.setter(v.getter()+t);
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
	return toCall.apply(toCall, parsedArgs);
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