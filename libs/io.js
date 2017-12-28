const stdin = require("../stdin.js");
const stdinreader = stdin(process?process.stdin.fd:-1)
const fs = require("fs");
module.exports = function(globals){
    var objects = require("../objects.js");
    /**
     * The IO library. Gets inputs, makes outputs.
     * @class io
     */
    var ioObj = objects.newList();
    var io = ioObj.vars;
    module.exports = ()=>ioObj;


    if(process && process.stdin){
        var t_stdin;
        var t_stdout;
        io.stdin = ()=>t_stdin=t_stdin||objects.newStream(process.stdin);
        io.stdout = ()=>t_stdout=t_stdout||objects.newStream(process.stdout);
    }

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
    io.read = function(mode=""){
        if(mode=="*n")
            return stdinreader.read_number();
        else if(mode=="*a")
            return stdinreader.read_until("$a^")
        else
            return stdinreader.read_line();
    }

    /**
     * A file to read or write to.
     * @class File
     * @extends Object
     * @see io.open
     */

    /**
     * Open a file for reading or writing.
     * @function
     * @memberof io
     * @param {string} file - The path to the file relative to the CWD.
     * @param {string} [mode="r"] - The method to open the file.
     * @returns {File} opened - The opened file.
     */
    io.open = function(filename, mode="r"){
        var fd = fs.openSync(filename, mode);
        var file = objects.newList();
        var f = file.vars;
        var reader = stdin(fd);

        f.descriptor = fd;
        f.name = filename;
        f.alive = true;

        /**
         * Read text from a file.
         * @function
         * @memberof File
         * @param {File} file - The file to read from.
         * @param {string} [mode=""] - Method to read, defaults to line by line.
         * Methods are:
         *  *n - Read a number
         *  *a - Read the entire text.
         * @returns {string} text - The read string or nil.
         */
        f.read = function(file, mode=""){
            if(mode=="*n")
                return reader.read_number();
            else if(mode=="*a")
                return reader.read_until("$a^")
            else
                return reader.read_line();
        }

        /**
         * Write text to a file.
         * @function
         * @memberof File
         * @param {File} file 
         * @param {string} text 
         * @returns {string} text - The input text.
         */
        f.write = function(file, text){
            var buf = new Buffer(text);
            fs.writeSync(fd, buf);
            return text;
        }

        /**
         * Build an iterator out of the lines in a file.
         * Always starts from the start of the file.
         * @function
         * @memberof File
         * @param {string} file - The file to iterate over
         * @returns {function} iter - The iterator function
         */
        f.lines = function(file){
            var tempReader = stdin(file.vars.descriptor);
            return tempReader.read_line
        }

        /**
         * Close a file, preventing it from being accessed further.
         * @memberof File
         * @param {File} file - The file to close.
         * @returns {File} file - The same file, closed. Reading a closed file may have unintended behavoir.
         */
        f.close = function(file){
            file.alive = false;
            fs.closeSync(fd);
            return file;
        }


        return file;
    }

    return ioObj;
}