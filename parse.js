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
	if(typ == "tryblock")
		return parse.TryBlock(exp, scope)
	if(typ == "forloop")
		return parse.ForLoop(exp, scope);
	if(typ == "ifblock")
		return parse.IfBlock(exp, scope);
	if(typ == "ternary")
		return parse.Ternary(exp, scope);
	if(typ == "whileblock")
		return parse.WhileBlock(exp, scope);
	if(typ == "switchblock")
		return parse.SwitchBlock(exp, scope);
	if(typ == "whenblock")
		return parse.WhenBlock(exp, scope);
	if(typ == "crementor")
		return parse.Crementor(exp, scope);
	if(typ == "is")
		return parse.IsEvent(exp, scope);
	if(typ == "eval")
		return parse.Eval(exp, scope);
	if(typ == "return")
		return parse.Return(exp, scope);
	if(typ == "withblock")
		return parse.With(exp, scope);
	throw new Error("Unknown expression type: "+typ)
}

parse.Assignment = function(assign, scope, expscope){
	var dat = assign.data;
	var v = parse.Var(dat[0].items[0], scope);
	if(v){
		if(dat[1].count){
			var l = v.getter()
			var op = dat[1].items[0].data[0].items[0].name
			if(op == "and"){
				if (l){
					v.setter(parse.Expression(dat[3].items[0], expscope || scope))
				}else{
					v.setter(l)
				}
			}else if(op == "or"){
				if (l){
					v.setter(l)
				}else{
					v.setter(parse.Expression(dat[3].items[0], expscope || scope))
				}
			}else{
				v.setter(parse.Operator(op, v.getter(), parse.Expression(dat[3].items[0], expscope || scope)));
			}
			return v.getter()
		}else{
			var val = parse.Expression(dat[3].items[0], expscope || scope);
			v.setter(val);
			return v.getter();
		}
	}
}


var returnMethod = "";
var returning = false;
var retValue = false;
parse.Return = function(exp, scope){
	var retOrBreak = exp.data[0].items[0];
	var valToSend = exp.data[1].count?parse.Expression(exp.data[1].items[0],scope):undefined;
	returning = 1;
	returnMethod = retOrBreak;
	retValue = valToSend;
	return retValue;
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

parse.UnOperator = function(name, l){
	var func = globals.vars.math.getVar(name)
	if(!func)
		throw new Error("Unknown operator: "+name)
	if(globals.vars.getMetaFunc(l, "_"+name)){
		var v = globals.vars.getMetaFunc(l, "_"+name)(l)
		return v===undefined ? func(l) : v
	}
	return func(l)
}

parse.UnaryArithmatic = function(arith, scope){
	var l = arith.data[1].items[0];
	l = parse.Expression(l, scope);
	
	return parse.UnOperator(arith.data[0].items[0].data[0].name, l);
}

globals.vars.math.vars.unm = a=>-a
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

	cons = cons.name=="constant"?cons.data[0].items[0]:cons;
	var constyp = cons.name;
	if(constyp == "numberconstant")
		return Number(cons.data[0].items[0]);
	if(constyp == "stringconstant"){
		if(cons.data[0].name == "\\[(=*)\\[(?:.|[^a])*?\\]\\1\\]")
			return cons.data[0].items[0].match(/\[(=*)\[((?:.|[^a])*?)\]\1\]/)[2]
		else if(cons.data[0].name == "templatestring"){
			var tmplt = cons.data[0].items[0];
			var outStr = "";
			if(tmplt.data[1].count){
				outStr += eval('"'+tmplt.data[1].items[0].data[0].items[0].replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/[`"]/g,a=>a=='`'?'"':'`')+'"').replace(/[`"]/g,a=>a=='`'?'"':'`')
			}
			for(var i=0; i < tmplt.data[2].count; i++){
				var chnk = tmplt.data[2].items[i];
				var exprs = chnk.data[0].items[0].data[1].items
				var outVal = "";
				for(var c=0;c<exprs.length;c++){
					outVal = globals.vars.toString(parse.Expression(exprs[c],scope))
				}
				outStr += globals.vars.toString(outVal)
				if(chnk.data[1].count){
					outStr += eval('"'+chnk.data[1].items[0].data[0].items[0].replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/[`"]/g,a=>a=='`'?'"':'`')+'"').replace(/[`"]/g,a=>a=='`'?'"':'`')
				}
			}
			return outStr;
		}else
			return eval(cons.data[0].items[0].replace(/\r/g,"\\r").replace(/\n/g,"\\n"));
	}if(constyp == "tableconstant"){
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
					scope.setVar(name,val);
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
						var fnc= function(){
							return v(rootTab, ...arguments)
						}
						fnc.stringify = dat.text;
						return fnc
					}
					return v;
				},
				setter: function(val){
					var m = objects.getMetaFunc(rootTab, "_newIndex")
					if(m && typeof(m)=="function"){
						m(rootTab,name,val);
					}else{
						rootTab[name] = val;
					}
				}
			}
		else
			return {
				scope: rootTab,
				getter: function(){
					var v = rootTab.getVar(name);
					if(curry){
						var fnc= function(){
							return v(rootTab, ...arguments)
						}
						fnc.stringify = dat.text;
						return fnc
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
		var splatHolder;
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
			if(func.data[0].items[0].data[2].count){
				splatHolder = parse.Var(func.data[0].items[0].data[2].items[0].data[1].items[0],arglistScope)
			}
		}
		var toDo = func.data[2].items[0].data[0].items[0];
		//console.log(toDo);
		func = function(){
			var tmpScope = objects.newScope(expScope);
			var curArguments = (func.scope || tmpScope).vars.arguments;
			(func.scope || tmpScope).vars.arguments = objects.newList()
			var res = objects.newList();
			var resI = 0;
			for(var i=0; i < arguments.length; i++){
				(func.scope || tmpScope).vars.arguments.vars[i] = arguments[i]
				if(vList[i])
					vList[i].setter(arguments[i])
				else
					res.vars[resI++] = arguments[i];
			}
			if(splatHolder){
				splatHolder.setter(res);
			}
			for(var i=arguments.length+1; i<vList.length; i++){
				vList[i].setter(undefined)
			}
			for(var name in arglistScope.vars){
				(func.scope || tmpScope).vars[name] = arglistScope.vars[name];
				(func.scope || tmpScope).defined[name] = true;
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
		var splatHolder;
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
			if(func.data[2].items[0].data[2].count){
				splatHolder = parse.Var(func.data[2].items[0].data[2].items[0].data[1].items[0],arglistScope)
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
			var res = objects.newList();
			var resI = 0;
			for(var i=0; i < arguments.length; i++){
				(func.scope || tmpScope).vars.arguments.vars[i] = arguments[i]
				if(vList[i])
					vList[i].setter(arguments[i])
				else
					res.vars[resI++] = arguments[i];
			}
			if(splatHolder){
				splatHolder.setter(res);
			}
			for(var i=arguments.length; i<vList.length; i++){
				vList[i].setter(undefined)
			}
			for(var name in arglistScope.vars){
				(func.scope || tmpScope).vars[name] = arglistScope.vars[name];
				(func.scope || tmpScope).defined[name] = true;
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

parse.SwitchBlock = function(block, scope){
	var val = parse.Expression(block.data[1].items[0],scope);
	var cases = block.data[2].items[0];
	cases = cases.data[0].name == '{' ? cases.data[1].items : cases.data[0].items;
	var startedHitting = false;
	var lastOut = undefined;
	for(var i=0; i < cases.length; i++){
		var cse = cases[i];
		var typ = cse.data[1].name;
		var toDo;
		if(typ=='case'){
			toDo = cse.data[3].items;
			if(parse.Operator("eq",val,parse.Expression(cse.data[2].items[0],scope))) // *Screams at this one expression in particular.
				startedHitting = true;
		}else{
			toDo = cse.data[2].items;
			startedHitting = true;
		}
		if(startedHitting){
			var subScope = objects.newScope(scope);
			for(var c=0; c < toDo.length; c++){
				lastOut = parse.Expression(toDo[c].data[0].items[0],subScope)
				if(returning){
					if(returnMethod == "break") returning = 0;
					return retValue;
				}
			}
		}
		if(returning){
			if(returnMethod == "break") returning = 0;
			return retValue;
		}
	}
	return lastOut;
}

parse.With = function(exp, scope){
	var obj = parse.Expression(exp.data[1].items[0], scope);
	if (globals.vars.type(obj)!="object"){
		var o = objets.newList();
		o.vars.this = obj;
		obj = o;
	}
	var newScope = objects.newScope(scope);
	newScope.vars = obj.vars;
	return parse.ExpBlock(exp.data[2].items[0], newScope);
}

parse.WhenBlock = function(when, scope){
	var evnt = parse.Expression(when.data[1].items[0], scope);
	var todo = function(){
		var nScope = objects.newScope(scope);
		nScope.vars.arguments = objects.ListFromObject(arguments);
		parse.ExpBlock(when.data[2].items[0], nScope);
	}
	evnt.vars.hook(todo);
}

parse.IsEvent = function(is, scope){
	var v = parse.Var(is.data[0].items[0].data[0].items[0], scope);
	var evnt = objects.newEvent();
	if(v.scope){
		v.scope.listeners.push(()=>{
			if(is.data[2].name == '\\*' || v.getter() == parse.Expression(is.data[2].items[0], scope)){
				evnt.vars.call();
			}
		})
	}
	return evnt;
}

parse.Deop = function(expBlock, scope){
	var tp = expBlock.data[1].name
	if(tp == "operator"){
		var op = expBlock.data[1].items[0].data[0].items[0].name;
		func = (a,b)=>parse.Operator(op,a,b);
		func.stringify = expBlock.text;
		return func;
	}else if(tp == "unoperator"){
		var op = expBlock.data[1].items[0].data[0].items[0].name;
		func = a=>parse.UnOperator(op,a);
		func.stringify = expBlock.text;
		return func;
	}else if(tp == "expression"){
		func = a=>parse.Expression(expBlock.data[1].items[0], scope);
		func.stringify = expBlock.text;
		return func;
	}
}

parse.ExpBlock = function(expBlock, scope,catchbreak){
	if(expBlock.data[0].name == "block"){
		var subScope = objects.newScope(scope);
		return parse.Program(expBlock.data[0].items[0], subScope, catchbreak)
	}else{
		return parse.Expression(expBlock.data[0].items[0], scope)
	}
}

parse.TryBlock = function(expBlock, scope){
	var toRun = expBlock.data[1].items[0];
	var out;
	try{
		out = parse.ExpBlock(toRun,scope,true);
	}catch(e){
		if(returning){
			return retValue;
		}
		if(expBlock.data[2].count > 0){
			var catcher = expBlock.data[2].items[0];
			var catchExp = catcher.data[2].items[0];
			
			var scop = objects.newScope(scope);
			if(catcher.data[1].count){
				var arg = catcher.data[1].items[0].data[1].items[0].data[1].items[0]
				scop.setVar(arg, e.toString());
			}
			out = parse.ExpBlock(catchExp, scop, true);
		}
	}
	return out;
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
				lastOut = parse.ExpBlock(forloop.data[4].items[0], scope, true);
				if(returning){
					if(returnMethod == "break") returning = 0;
					return retValue;
				}
			}
			return lastOut
		}
		if(typeof iter == "string"){
			for(var i=0; i < iter.length; i++){
				v.setter(iter[i]);
				lastOut = parse.ExpBlock(forloop.data[4].items[0], scope, true);
				if(returning){
					if(returnMethod == "break") returning = 0;
					return retValue;
				}
			}
			return lastOut;
		}
		if(typeof iter != "function")
			return;
		var val;

		while((val = iter(val))!=undefined){
			v.setter(val);
			lastOut = parse.ExpBlock(forloop.data[4].items[0], scope, true);
			if(returning){
				if(returnMethod == "break") returning = 0;
				return retValue;
			}
		}
		return lastOut;
	}else{
		var exprs = forloop.data[2].items;
		var todo = forloop.data[4].items[0];
		if(exprs.length >= 1)
			parse.Expression(exprs[0].data[0].items[0], subScope);
		while(exprs.length >= 2?parse.Expression(exprs[1].data[0].items[0], subScope):true){
			lastOut = parse.ExpBlock(todo, subScope, true);
			if(returning){
				if(returnMethod == "break") returning = 0;
				return retValue;
			}
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

	fnk.stringify = str;
	return fnk;
}

parse.IfBlock = function(ifb, scope){
	var subScope = objects.newScope(scope);
	var exp = ifb.data[1].items[0];
	var todo = ifb.data[2].items[0];
	if(parse.Expression(exp, subScope)){
		return parse.ExpBlock(todo, scope, true);
	}else{
		if(ifb.data[3].count > 0){
			todo = ifb.data[3].items[0].data[1].items[0];
			return parse.ExpBlock(todo, subScope, true);
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
		parse.ExpBlock(todo, scope, true);
		if(returning){
			if(returnMethod == "break") returning = 0;
			return retValue;
		}
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
	var parsedArgs = [];
	var argType = (call.data[2]||call.data[1]).name;
	if(argType == "call_1"){
		var args = call.data[2].items;
		for(var i=0; i < args.length; i++){
			if(args[i].data[0].name=="expression"){
				var val = parse.Expression(args[i].data[0].items[0], scope);
				parsedArgs.push(val);
			}else{
				var splat = args[i].data[0].items[0];
				var val = parse.Expression(splat.data[1].items[0], scope);
				if(val && typeof(val)=="object" && val.vars!==undefined){
					for(var c=0; val.vars[c]!==undefined; c++){
						parsedArgs.push(val.vars[c])
					}
				}
			}
		}
	}else if(argType == "stringconstant" || argType == "tableconstant"){
		parsedArgs[0] = parse.Constant(call.data[1].items[0], scope)
	}else if(argType == "deop"){
		parsedArgs[0] = parse.Deop(call.data[1].items[0], scope);
	}else if(argType == "splat_call"){
		var args = parse.Expression(call.data[1].items[0].data[1].items[0], scope)
		for(var c=0; args.vars[c]!==undefined; c++){
			parsedArgs.push(args.vars[c])
		}
	}else{
		throw `unknown call method: ${argType}`
	}
	if(typeof globals.vars.getMetaFunc(toCall, "_call") == "function"){
		return globals.vars.getMetaFunc(toCall, "_call").apply(toCall, [toCall].concat(parsedArgs));
	}
	if(typeof toCall == "function")
		return toCall.apply(toCall, parsedArgs);
	return toCall;
}

parse.Program = function(prog, upscope, catchBreak){
	//console.log(JSON.stringify(prog, null, 2))
	var scope = objects.newScope(upscope || globals);
	var expressions = prog.data[0].items;
	if(prog.name == "block"){
		expressions = prog.data[1].items;
	}
	var returnvalue = undefined;
	for(var i=0; i < expressions.length; i++){
		returnvalue = parse.Expression(expressions[i].data[0].items[0], scope);
		if(returning){
			
			if(returnMethod == "return" && !catchBreak){
				returning = 0;
			}
			return retValue;
		}
	}
	return returnvalue;
}