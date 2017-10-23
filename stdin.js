// This entire ridiculous file is just to handle STDIN.
const fs = require('fs')

var BUFSIZE=4;
var buf = new Buffer(BUFSIZE);
var tmp = new Buffer(BUFSIZE);
var tmp_len = 0;
var buf_len = 0;
var br;
var builtStr = "";

function read_until(cond){
    while(!builtStr.match(cond)){
        // If the temp buffer is empty
        if(!tmp_len){
            // Fill it.
            try{
                tmp_len += fs.readSync(process.stdin.fd, tmp, 0, BUFSIZE);
            }catch(e){
                return undefined;
            }
        }
        // If the main buffer can fit the temp one.
        if(tmp_len>0 && buf_len<BUFSIZE){
            // Copy what we can into the main buffer.
            var toCopy = Math.min(tmp_len, BUFSIZE-buf_len);
            tmp.copy(buf, buf_len, 0, toCopy);
            var newTmp = new Buffer(BUFSIZE);
            tmp.copy(newTmp, 0, 0, toCopy);
            tmp = newTmp;
            tmp_len = tmp_len - toCopy;
            buf_len = buf_len + toCopy;
        }
        // Fill the built string, and zero out it's buffer.
        builtStr += buf.toString("utf8",0,buf_len)
        buf_len = 0;
    }
    var out = builtStr.match(cond)
    builtStr = builtStr.substr(out[0].length-1);
    return out[1];
}

module.exports = {
    read_until : read_until,
    read_line : ()=>read_until(/(.*)\r?\n/),
    read_number : ()=>read_until(/(.*)\D/)
}