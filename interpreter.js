const fs = require("fs");
const tokenizer = require("./tokenizer.js");
const parse = require("./parse.js");
var target = process.argv[2];
if(target){
	fs.readFile(target, (err,data)=>{
		if(err)
			throw err;
		parse.Program(tokenizer.compile(data.toString()));
	})
}else{
	console.log("Usage: "+process.argv[0]+" "+process.argv[1]+" <file>")
}