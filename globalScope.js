const objects = require("./objects.js");
const fs = require("fs");
const globals = {};

////////////////////////
// LOAD THE LIBRARIES //
////////////////////////
var libs = fs.readdirSync("./libs")
for(var id in libs){
	var lib_name = libs[id].replace(/\.js$/,"")
	globals[lib_name] = require("./libs/"+libs[id])(globals);
}

delete globals.globals; // We don't actually want this to be a lib.

objects.getMetaFunc = globals.getMetaFunc;

globals.defaultMeta = objects.newList();
globals.defaultMeta.vars.string = objects.newList();
globals.defaultMeta.vars.string.vars._index = globals.string;
globals.defaultMeta.vars.string.vars._mod = (a,b)=>{
	if(typeof(b)=="object"){
		return globals.table.vars.apply(globals.table.vars.add(a, b), globals.string.vars.format)
	}else{
		return globals.string.vars.format(a, b)
	}
}
globals.defaultMeta.vars.string.vars._mult = (a,b)=>typeof(a)=="string"&&typeof(b)=="number"?
								   globals.string.vars.rep(a,b) :typeof(a)=="number"&&typeof(b)=="string"?
								   globals.string.vars.rep(b,a) :undefined;

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