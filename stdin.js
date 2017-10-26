// This entire ridiculous file is just to handle STDIN.
const fs = require('fs')

var BUFSIZE=256;
var tmp = new Buffer(BUFSIZE);
var tmp_len = 0;
var builtStr = "";

function read_until(cond){
    var out;
    while(!(out = builtStr.match(cond))){
        try{
            tmp_len = fs.readSync(process.stdin.fd, tmp, 0, BUFSIZE);
            if(tmp_len==0){
                return undefined;
            }
            builtStr += tmp.toString("utf8",0,tmp_len)
        }catch(e){
            return undefined;
        }
    }
    builtStr = builtStr.substr(out[0].length);
    return out[1];
}

module.exports = {
    read_until : read_until,
    read_line : ()=>read_until(/(.*)\r?\n/),
    read_number : ()=>read_until(/(.*)\D/)
}