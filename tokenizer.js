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
	tokens.compiled = {};

	for(name in raw){
		var tkn = raw[name];
		var option = [];
		var options = [];
		while (tkn.length > 0){
			tkn = tkn.replace(/^\s*/, ""); // Remove all leading whitespace.
			var subtkn = tkn.match(match_upto);
			var spec = subtkn[6];
			subtkn = subtkn[1];
			tkn = tkn.replace(match_upto, "");
			if(subtkn.length > 0){
				var compiledtoken = compile_token(subtkn);
				if(compiledtoken){
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


var matchToken = function(tokenname, str, oldToken){
	var token = tokens.compiled[tokenname];
	for(var option_id = 0; option_id < token.length; option_id++){
		var oToken = oldToken
		var option = token[option_id];
		var built = [];
		var success = true;
		var sub_str = str;
		var usedpref = false;
		for(var sub_id = 0; sub_id < option.length; sub_id++){
			sub_str = sub_str.replace(/^\s*/, "");
			// continue moves to the next token, break moves to the next option.
			// default behaviour should be to return false...
			var this_match = [];
			var subtoken = option[sub_id];
			var typ = subtoken.type;
			var count = subtoken.count;
			var text = subtoken.text;
			var prefix = subtoken.prefix;
			var maxMatches = count[1];
			if(prefix){
				if(!oToken){
					success = false;
					break;
				}
				if(!oToken.name){
					success = false;
					break;
				}
				if(oToken.name != text){
					success = false;
					break;
				}
				this_match.push(oToken);
				usedpref = true;
				oToken = false;
			}else if(typ == "token"){
				while(maxMatches!=0){
					var under_match = matchToken(text, sub_str, oToken);
					if(under_match){
						sub_str = under_match.remainder;
						this_match.push(under_match)
						usedpref = usedpref || under_match.usedpref;
						maxMatches--;
					}else{
						break;
					}
				}
			}else{
				while(maxMatches!=0){
					var str_match = sub_str.match(new RegExp("^"+text));
					if(str_match){
						sub_str = sub_str.replace(new RegExp("^"+text), "");
						this_match.push(str_match[0]);
						maxMatches--;
					}else{
						break;
					}
				}
			}
			oToken = false;
			if(this_match.length < count[0] || (count[1]!=-1 && this_match.length > count[1])){
				success = false;
				break;
			}
			built.push({name: text, count: this_match.length, items: this_match});
		}
		if(success){
			var newToken = {data: built, name: tokenname, remainder: sub_str};
			if(usedpref)
				newToken.usedpref = true
			
			if(!sub_str)
				return newToken
			var otherMtch = matchToken(tokenname, sub_str, newToken)
			if(otherMtch.usedpref){
				otherMtch.usedpref = usedpref;
				return otherMtch;
			}
			return newToken;
		}
	}
	return false;
}
// console.log(JSON.stringify(matchToken("program", "a[2] = 3"),null,2))

module.exports = {compile : program=>matchToken("program", program),
				  tokens : tokens,
				  matchToken : matchToken}