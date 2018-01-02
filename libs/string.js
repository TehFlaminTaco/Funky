module.exports = function(globals){
    var objects = require("../objects.js");
    /**
     * The string library.
     * Strings also use this as a parent.
     * @class string
     */
    var stringObj = objects.newList();
    var string = stringObj.vars;
    module.exports = ()=>stringObj;

    // Format
    /**
     * Use a string as a template for a bunch of other strings.
     * @function
     * @memberof string
     * @param {string} format - The format template to use.
     * @param {...*} arguments - Objects to apply to the template.
     * @returns {string} formatted - The formatted string.
     */
    string.format = function(str){
        var splt = str.match(/%.|./g)
        var out = "";
        var argi = 1;
        for(var i = 0; i < splt.length; i++){
            var s = splt[i];
            if(s[0]=="%"){
                var action = string.format[s[1]] || string.format[s[1].toLowerCase()]
                if(!action)
                    throw "Unknown format type: "+s[1];
                out += action(arguments[argi++]);
            }else{
                out += s;
            }
        }
        return out;
    }
    string.format.s = s=>globals.toString(s);
    string.format.u = s=>globals.toString(s).toUpperCase();
    string.format.l = s=>globals.toString(s).toLowerCase()
    string.format.c = s=>string.char(Number(s))
    string.format.b = s=>string.byte(globals.toString(s))
    string.format.q = s=>JSON.stringify(s);
    string.format.i = s=>Math.floor(Number(s))
    string.format.f = string.format.d = string.format.n = s=>Number(s)
    string.format.x = s=>Number(s).toString(16)
    string.format.X = s=>Number(s).toString(16).toUpperCase()
    string.format['%'] = ()=>'%'

    // Basic Manipulation
    /**
     * @function
     * @memberof string
     * @param {string} string - The string to repeat
     * @param {number} count - The amount of times to repeat the string.
     * @return {string} repeated - The string repeated.
     */
    string.rep = (s,n)=>s.repeat(Math.max(n,0))
    /** @todo document these functions (My laziness knows no bounds) */
    /** @function
     * @memberof string */
    string.reverse = s=>s.split("").reverse().join("")
    string.lower = s=>s.toLowerCase()
    /** @function
     * @memberof string */
    string.upper = s=>s.toUpperCase()
    /** @function
     * @memberof string */
    string.sub = (s,a,b)=> s.substring(a,b)

    // Character Code Stuff
    /** @function
     * @memberof string */
    string.byte = s=>s.charCodeAt(0)
    /** @function
     * @memberof string */
    string.char = s=>String.fromCharCode(s)

    // Regex stuff
    /**
     * Replace all instances of needle in haystack with replace. Replace may be a function.
     * @function
     * @memberof string
     * @param {string} haystack - The string to search through.
     * @param {string} needle - The regex to match.
     * @param {string|function} replace - The value to replace with. If a function, passes a match object and uses its return value.
     * @returns {string} replaced - The new modified string.
     */
    string.gsub = (a,b,c)=>a.replace(new RegExp(b,'g'),c)
    /**
     * Replace each character in a string with replace.
     * @function
     * @memberof string
     * @param {string} haystack - The string to iterate through.
     * @param {string|function} - The value to replace with.
     * @returns {string} replaced - The new modified string.
     */
    string.map = (a,b)=>a.replace(/.|[^a]/g,b);
    /**
     * Determine if a needle matches a haystack, and if it does, return a match object.
     * @function
     * @memberof string
     * @param {string} hastack - The string to search through.
     * @param {string} needle - The regex to match.
     * @returns {object} matchobject - An object containing the match information or undefined.
     */
    string.match = (a,b)=>objects.ListFromObject(a.match(new RegExp(b)))||false;
    /**
     * Build an iterator from a needle and haystack. Each iteration returns the next match.
     * @function
     * @memberof string
     * @param {string} hastack - The string to search through.
     * @param {string} needle - The regex to match.
     * @returns {function} iterator - The iterator function.
     */
    string.gmatch = (s, regex)=>{
        var reg = new RegExp(regex,"g");
        return ()=>{
            var next = reg.exec(s);
            if(next){
                var oot = objects.ListFromObject(next);
                if(oot && oot.vars.index!=undefined){
                    return oot
                }
            }
        }
    }
    /**
     * Split a string by a regex.
     * @function
     * @memberof string
     * @param {string} haystack
     * @param {string} needle
     * @returns {object} list - The split string.
     */
    string.split = (s, regex)=>objects.ListFromObject(s.split(regex));

    /**
     * Determine where a substring exists in a string and returns the first index of it.
     * @function
     * @memberof string
     * @param {string} haystack
     * @param {string} needle
     * @returns {number|nil} index - The first index of the substring or nil.
     */
    string.find = (s, needle)=>{
        var tar = s.indexOf(needle)
        if(tar == -1)
            return undefined
        return tar
    }

    /**
     * Determine where a substring exists in a string and returns the last index of it.
     * @function
     * @memberof string
     * @param {string} haystack
     * @param {string} needle
     * @returns {number|nil} index - The last index of the substring or nil.
     */
    string.findLast = (s, needle)=>{
        var tar = s.lastIndexOf(needle)
        if(tar == -1)
            return undefined
        return tar
    }

    return stringObj;
}