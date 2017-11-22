/*	STRUCTURE OF A TOKEN
 *	{
 *   	name: tokenName
 *		data: [	// Each of these contain a datalet like below.
 * 			{
 *				name: subtokenName
 *				items: eachItemUnderThisName
 * 			}
 *		]
 *  }
 *
 *
 */



const fs = require("fs");

var tokens = require("./tokens.js");

const spec_chars = "[\\s|]";	// Special Modifier Characters.
const match_string = "(['\"`])(([^\\\\]*?|\\\\.)*?)\\1";
const match_upto = new RegExp("(((['\"`])(([^\\\\]*?|\\\\.)*?)\\3|.)*?)("+spec_chars+"|$)");
const modif_match = /^(.*?)((\*|\+|:|\?|\{\s*\d*\s*(?:,\s*\d*\s*)?\})*)$/
const modif_sect_match = /([*+?:]|\{\s*\d*\s*(?:,\s*\d*\s*)?\})/g
const modif_n_match = /\{\s*(\d*)\s*(?:,\s*(\d*)\s*)?\}/

function compile_token(str){
	var parts = str.match(modif_match);
	var modif = parts[2]||"";
	modif = modif.match(modif_sect_match)||[];
	var tkn = parts[1];
	var token = {prefix: false, count: [1,1], type: 'token', text: tkn};

	for(var i=0; i < modif.length; i++){
		var s = modif[i][0];
		if(s=="?")
			token.count = [0,1];
		else if(s=="*")
			token.count = [0,-1];
		else if(s=="+")
			token.count = [1,-1];
		else if(s==":")
			token.prefix = true;
		else if(s=="{"){
			var count = modif[i].match(modif_n_match);
			var min = count[1]||0;
			var max = count[2]||-1;
			token.count = [min,max];
		}

	}
	if(tkn[0]=='"'||tkn[0]=="'"||tkn[0]=="`"){
		token.type = "regex"
		token.text = tkn.match(/(['"`])((.|\s)*)\1/)[2]
	}
	if(token.type == "token" && !tokens.raw[token.text]){
		throw new Error("Undefined token: "+token.text)
	}
	return token
}

// Compile the tokens if they're not compiled / updated.
if(!tokens.valid || !tokens.compiled){
	var raw = tokens.raw;
	var t = {};
	if(!raw)
		throw new Error("Unable to update tokens. No tokens provided.");
	if(raw.program === undefined)
		throw new Error("Tokens must define 'program'");
	tokens.compiled = {};
	tokens.prefixes = {};

	for(name in raw){
		var tkn = raw[name];
		var option = [];
		var options = [];
		if(tkn[0]=="@"){
			options.push({"prefix": false,"count": [0,0],"type": "forceWS","text": ""+("1"==tkn[1])})
			tkn = tkn.substr(2)
		}
		while (tkn.length > 0){
			tkn = tkn.replace(/^\s*/, ""); // Remove all leading whitespace.
			var subtkn = tkn.match(match_upto);
			var spec = subtkn[6];
			subtkn = subtkn[1];
			tkn = tkn.replace(match_upto, "");
			if(subtkn.length > 0){
				var compiledtoken = compile_token(subtkn);
				if(compiledtoken){
					if(compiledtoken.prefix){
						tokens.prefixes[compiledtoken.text] = tokens.prefixes[compiledtoken.text] || {}
						tokens.prefixes[compiledtoken.text][name] = options
					}
					option.push(compiledtoken);
				}
			}
			if(spec == "|"){
				if(option.length > 0)
					options.push(option)
				option = [];
			}
		}
		if(option.length>0)
			options.push(option);
		tokens.compiled[name] = options;
	}
	tokens.valid = true;
	fs.writeFile("./tokens.js", "module.exports="+JSON.stringify(tokens,false,2), ()=>{
		console.log("Saved compiled tokens...")
	})
}

var wsStack = [true];
var matchToken = function(tokenname, str, i, as_prefix){
	var token = tokens.compiled[tokenname];
	if(token[0].type=="forceWS"){
		wsStack.push(token[0].text=="true")
		token = token.slice(1)
	}else{
		wsStack.push(wsStack[wsStack.length-1])
	}
	i = (i||0)+1;
	if(i >= 300)
		throw new Error("Surpassed Recursion Limit.")
	for(var option_id = 0; option_id < token.length; option_id++){
		var option = token[option_id];
		var option_str = str;
		var match = [];
		var needtousepref = !!as_prefix
		var success = true;
		for(var sub_id = 0; sub_id < option.length; sub_id++){
			var to_match = option[sub_id]
			var max_matches = to_match.count[1];
			var this_match = [];
			while(max_matches != 0){
				if(wsStack[wsStack.length-1])
					option_str = option_str.replace(/^(\$\*([^*]|\*[^$])*\*\$|\$[^*\r\n].*|\s)*/,"");
				if(to_match.prefix){
					if(as_prefix){
						this_match.push(as_prefix)
						needtousepref = false
					}
					break
				}else if(to_match.type == "token"){
					var subMatch = matchToken(to_match.text, option_str, i)
					if(subMatch){
						option_str = subMatch.remainder
						this_match.push(subMatch)
					}else{
						break;
					}
				}else if(to_match.type == "regex"){
					var str_match = option_str.match(new RegExp("^"+to_match.text));
	
					if(str_match){
						option_str = option_str.replace(new RegExp("^"+to_match.text),"");
						this_match.push(str_match[0])
					}else{
						break
					}
				}
				max_matches --
			}
			if(this_match.length < to_match.count[0] || (to_match.count[1]!=-1 && this_match.length > to_match.count[1])){
				success = false;
				break;
			}
			match.push({name: to_match.text, count: this_match.length, items: this_match})
		}
		if(needtousepref){
			success = false;
		}
		if(success){
			var prfxes = tokens.prefixes[tokenname]
			var this_tokn = {data: match, name: tokenname, remainder: option_str, text: str.substr(0, str.length - option_str.length)}
			if(prfxes){
				while(true){
					var shortest = this_tokn
					var shortlen = option_str.length
					for (var name in prfxes){
						var contestent = matchToken(name, option_str, i, this_tokn)
						if(contestent && contestent.remainder.length < shortlen){
							shortlen = contestent.remainder.length
							contestent.text = str.substr(0, str.length-contestent.remainder.length)
							shortest = {data: [{name: name, count: 1, items: [contestent]}], name:tokenname, remainder: contestent.remainder, text: contestent.text}
						}
					}
					option_str = shortest.remainder
					if(shortest == this_tokn){
						wsStack.splice(wsStack.length-1,1)
						return shortest
					}
					this_tokn = shortest
				}
			}
			wsStack.splice(wsStack.length-1,1)
			return this_tokn
		}
	}
	wsStack.splice(wsStack.length-1,1)
}
// console.log(JSON.stringify(matchToken("program", "a[2] = 3"),null,2))

module.exports = {compile : program=>matchToken("program", program),
				  tokens : tokens,
				  matchToken : matchToken}