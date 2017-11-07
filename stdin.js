const fs = require('fs')

function newReader(fd){
    var BUFSIZE=256;
    var tmp = new Buffer(BUFSIZE);
    var tmp_len = 0;
    var builtStr = "";
    var read_until=function(cond){
        var out;
        while(!(out = builtStr.match(cond))){
            try{
                tmp_len = fs.readSync(fd, tmp, 0, BUFSIZE);
                if(tmp_len==0){
                    var outp = builtStr;
                    builtStr = "";
                    return outp.length>0?outp:undefined;
                }
                builtStr += tmp.toString("utf8",0,tmp_len)
            }catch(e){
                return undefined;
            }
        }
        builtStr = builtStr.substr(out[0].length);
        return out[1];
    }
    return {
        read_until : read_until,
        read_line : ()=>read_until(/(.*)\r?\n/),
        read_number : ()=>read_until(/(.*)\D/)
    }
}

module.exports = newReader;