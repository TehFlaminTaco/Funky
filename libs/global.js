const parse = require("../parse.js");
const tokenizer = require("../tokenizer.js");
const objects = require("../objects.js");
module.exports = function(globals){
    module.exports = globals;
    /**
     * Write strings to STDOUT, terminated by a newline and separated by spaces.
     * @global
     * @function
     * @name print
     * @param {...*} text - What to write to the console. Implicitly stringified.
     * @returns {string} arg1 - The stringified representation of the first argument.
     */
    globals.print = function(){
        var a = [];
        for(var i=0; i < arguments.length; i++)
            a[i] = globals.toString(arguments[i]);
        console.log(a.join(" "))
        return a[0];
    }

    /**
     * Write strings to STDOUT.
     * @global
     * @function
     * @name write
     * @param {...*} text - What to write to the console. Implicitly stringified.
     * @returns {string} arg1 - The stringified representation of the first argument.
     */
    globals.write = function(){
        var a = [];
        for(var i=0; i < arguments.length; i++)
            a[i] = globals.toString(arguments[i]);
        process.stdout.write(a.join(""))
        return a[0];
    }

    /**
     * Convert an object to a string. Calls the object's _toString metamethod if provided.
     * @global
     * @function
     * @name toString
     * @param {*} object - The object to stringify.
     * @returns {string} string - The stringified output.
     */
    globals.toString = s=>{
        f=globals.getMetaFunc(s, "_toString");
        if(f){
            if(globals.type(f)=="function")
                return f(s)
            else
                return f
        }
        return s==undefined?"nil":s.toString()
    }

    /**
     * Make an iterator for an input object. Value for the iterator is an object containing the current key and value pair.
     * @global
     * @function
     * @name pairs
     * @param {Object} list - The list to iterate through
     * @returns {function} iterator - The iterator function.
     */
    globals.pairs = function(list){
        var keys = Object.keys(list.vars);
        var i = 0;
        return ()=>{
            var l = objects.newList();
            l.vars[0] = keys[i++];
            l.vars[1] = list.vars[l.vars[0]];
            if(l.vars[1]!=undefined)
                return l;
        }
    }

    /**
     * Make an iterator for an input object. Value for the iterator is the current key.
     * @global
     * @function
     * @name keys
     * @param {Object} list - The list to iterate through
     * @returns {function} iterator - The iterator function.
     * @see pairs
     */
    globals.keys = function(list){
        var keys = Object.keys(list.vars);
        var i = 0;
        return ()=>{
            var l = keys[i++];
            if(l!=undefined)
                return l;
        }
    }

    /**
     * Make an iterator for an input object. Value for the iterator is the current value.
     * @global
     * @function
     * @name values
     * @param {Object} list - The list to iterate through
     * @returns {function} iterator - The iterator function.
     * @see pairs
     */
    globals.values = function(list){
        var keys = Object.keys(list.vars);
        var i = 0;
        return ()=>{
            var l = objects.newList();
            var key = keys[i++]
            var val = list.vars[key];
            if(val!=undefined)
                return val;
        }
    }

    /**
     * Create a new event. Can be hooked into with a when statement.
     * @global
     * @function
     * @name newEvent
     * @returns {Event} event - The new event object.
     */
    globals.newEvent = function(){
        return objects.newEvent();
    }

    /**
     * Create a new object. Functions similarly to {...}
     * @global
     * @function
     * @name newList
     * @returns {Object} list - The new object.
     */
    globals.newList = function(){
        var l = objects.newList();
        for(var i=0; i < arguments.length; i++){
            l.vars[i] = arguments[i];
        }
        return l;
    }

    /**
     * Create a new stream object.
     * @global
     * @function
     * @name newStream
     * @param {function} [func] - The function to stream through. Defaults to a cat.
     * @returns {Stream} stream - The new stream.
     */
    globals.newStream = function(obj){
        return objects.newStream(obj || (n=>n));
    }

    /**
     * Set the parent of one object to another. Undefined keys of an object fall through to its parent.
     * @global
     * @function
     * @name setParent
     * @param {Object} list - The target list
     * @param {Object} parent - The target parent
     * @returns {Object} list - The input list argument, now modified.
     */
    globals.setParent = function(list, otherlist){
        list.parent = otherlist;
        return list;
    }

    /**
     * Generate an event to fire in a certain number of milliseconds.
     * @global
     * @async
     * @function
     * @name later
     * @param {number} time - How long in milliseconds to wait before firing.
     * @param {function} [callback] - A function to hook to.
     * @returns {Event} event - The event created.
     */
    globals.later = function(time, callback){
        var evnt = objects.newEvent();
        if(callback)
            evnt.vars.hook(callback);
        setTimeout(evnt.vars.call, time||0);
        return evnt;
    }

    /**
     * Try to run a function. Returns {bsuccess, result/errorcode}
     * @global
     * @function
     * @name pcall
     * @param {function} tocall - The function to try to execute.
     * @param {...*} arguments - The arguments to call on the function.
     * @returns {Object} data - An object contain whether or not the execution was successful and the return value / error message.
     */
    globals.pcall = function(func,...args){
        var out = objects.newList()
        try{
            out.vars[1] = func(...args)
            out.vars[0] = true;
            return out;
        }catch(e){
            out.vars[0] = false;
            out.vars[1] = e.toString()
            return out;
        }
    }

    /**
     * Executes a string as Funky Code.
     * @global
     * @function
     * @name exec
     * @param {string} str - The text to compile and run.
     * @returns {*} result
     */
    globals.exec = function(str){
        var tkns = tokenizer.compile(str);
        if(!tkns){
            return false;
        }
        return parse.Program(tkns)
    }

    /**
     * Throw an error with a giving string as the text.
     * @global
     * @function
     * @name error
     * @param {string} [text] - The string to error. 
     */
    globals.error = function(str){
        throw(str||"");
    }

    /**
     * Returns the metafunction of a given name of an input value.
     * @global
     * @function
     * @name getMetaFunc
     * @param {*} object - The object to look in
     * @param {string} metamethod - The name of the metamethod to lookup.
     * @returns {function} The metamethod.
     */
    globals.getMetaFunc = function(val, name){
        if(val != null && typeof(val) == "object"){
            if(val.vars == undefined){
                return undefined;
            }
            if(globals.type(val.vars._meta) == "object" && val.vars._meta.vars[name] !== undefined){
                return val.vars._meta.vars[name];
            }
        }

        if(typeof globals.defaultMeta == "object" && typeof globals.defaultMeta.vars[globals.type(val)] == "object" && globals.defaultMeta.vars[globals.type(val)].vars[name]!==undefined){
            return globals.defaultMeta.vars[globals.type(val)].vars[name];	
        }
    }

    /**
     * Get the type of an object.
     * @global
     * @function
     * @name type
     * @param {*} object - The object to determine the type of.
     * @returns {string} type - The string referring to the type of the input object.
     */
    globals.type = ent =>{
        if(typeof(ent)!=='undefined' && ent!==null && ent.type){
            return ent.type;
        }else{
            return typeof ent;
        }
    }

    /** @constant
        @global
        @type {boolean}
        @default true
        @name true
    */
    globals.true = true;
    /** @constant
        @global
        @type {boolean}
        @default false
        @name false
    */
    globals.false = false;
    /** @constant
        @global
        @type {undefined}
        @default nil
        @name nil
    */
    globals.nil = undefined;

    /** @constant
     *  @global
     *  @type {Event}
     *  @default loaded
     *  @name loaded
     */
    globals.loaded = objects.newEvent()

    return globals;
}