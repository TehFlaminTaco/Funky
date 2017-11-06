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
     * @param {string} string - The string to repeat
     * @param {number} count - The amount of times to repeat the string.
     * @return {string} repeated - The string repeated.
     */
    string.rep = (s,n)=>s.repeat(Math.max(n,0))
    /** @todo document these functions (My laziness knows no bounds) */
    /** @function */
    string.reverse = s=>s.split("").reverse().join("")
    string.lower = s=>s.toLowerCase()
    /** @function */
    string.upper = s=>s.toUpperCase()
    /** @function */
    string.sub = (s,a,b)=> s.substring(a,b)

    // Character Code Stuff
    /** @function */
    string.byte = s=>s.charCodeAt(0)
    /** @function */
    string.char = s=>String.fromCharCode(s)

    // Regex stuff
    /**
     * Replace all instances of needle in haystack with replace. Replace may be a function.
     * @function
     * @param {string} haystack - The string to search through.
     * @param {string} needle - The regex to match.
     * @param {string|function} replace - The value to replace with. If a function, passes a match object and uses its return value.
     * @returns {string} replaced - The new modified string.
     */
    string.gsub = (a,b,c)=>a.replace(new RegExp(b,'g'),c)
    /**
     * Determine if a needle matches a haystack, and if it does, return a match object.
     * @function
     * @param {string} hastack - The string to search through.
     * @param {string} needle - The regex to match.
     * @returns {object} matchobject - An object containing the match information or undefined.
     */
    string.match = (a,b)=>objects.ListFromObject(a.match(new RegExp(b)))
    /**
     * Build an iterator from a needle and haystack. Each iteration returns the next match.
     * @function
     * @param {string} hastack - The string to search through.
     * @param {string} needle - The regex to match.
     * @returns {function} iterator - The iterator function.
     */
    string.gmatch = (s, regex)=>{
        var reg = new RegExp(regex,"g");
        return ()=>{
            var oot = objects.ListFromObject(reg.exec(s));
            if(oot.vars.index!=undefined){
                return oot
            }
        }
    }
    return stringObj;
}