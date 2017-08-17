const fs = require("fs");
const tokenizer = require("./tokenizer.js");
const parse = require("./parse.js");

parse.Program(
	tokenizer.compile(`
	a=3
	if(a==3){
		print("YEAH!")
	}else{
		print("NAH!")
	}
	`)
)