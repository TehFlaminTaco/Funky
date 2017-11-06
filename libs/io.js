const stdin = require("../stdin.js");
module.exports = function(globals){
    var objects = require("../objects.js");
    /**
     * The IO library. Gets inputs, makes outputs.
     * @class io
     */
    var ioObj = objects.newList();
    var io = ioObj.vars;
    module.exports = ()=>ioObj;

    /**
     * @function
     * @memberof io
     * @see write
     */
    io.write = function(){
        var a = [];
        for(var i=0; i < arguments.length; i++)
            a[i] = globals.toString(arguments[i]);
        process.stdout.write(a.join(""))
        return a[0];
    }
    /**
     * Read a line from STDIN
     * @function
     * @memberof io
     * @returns {string} line - The next line of STDIN.
     */
    io.read = function(method){
        return stdin.read_line();
    }
    return ioObj;
}