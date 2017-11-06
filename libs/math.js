module.exports = function(globals){
    var objects = require("../objects.js");
    /**
     * The Math Library.
     * @class math
     * @type {Object}
     */
    var mathObj = objects.newList();
    var math = mathObj.vars;
    module.exports = ()=>mathObj;

    // Constants
    /**
     * 3.141562...
     * @name math.pi
     * @constant
     * @type number
     * @default 3.141592653589793
     */
    math.pi = Math.PI
    /**
     * Euler's constant
     * @constant
     * @type number
     * @default 2.7182818284590455
     */
    math.e = Math.exp(1)

    // Numbers
    /**
     * Get the square root of a number.
     * @function
     * @param {number} n - The number to square root.
     * @returns {number} sqrt_n - The square root of n.
     */ 
    math.sqrt = Math.sqrt
    /**
     * Round a number to the nearest integer.
     * @function
     * @param n - The number to round
     * @param e - The power of 10 to round to.
     * @returns i - The rounded number.
     */
    math.round = (a,b)=>Math.round(a*10**(b||0))/10**(b||0)
    /**
     * Round a number to the next smallest integer.
     * @function
     * @param n - The number to round
     * @param e - The power of 10 to round to.
     * @returns i - The rounded number.
     */
    math.floor = (a,b)=>Math.floor(a*10**(b||0))/10**(b||0)
    /**
     * Round a number to the next largest integer.
     * @function
     * @param n - The number to round
     * @param e - The power of 10 to round to.
     * @returns i - The rounded number.
     */
    math.ceil  = (a,b)=>Math.ceil (a*10**(b||0))/10**(b||0)
    /**
     * Given numbers, return the largest.
     * @function
     * @param {...number} n - The numbers to compare.
     * @returns {number} max - The largest of n.
     */
    math.max = Math.max
    /**
     * Given numbers, return the smallest.
     * @function
     * @param {...number} n - The numbers to compare.
     * @returns {number} max - The smallest of n.
     */
    math.min = Math.min
    /**
     * Clamp a number between a min and a max.
     * @function
     * @param {number} a - The number to clamp
     * @param {number} b - The minimum
     * @param {number} c - The maximum
     * @returns {number} n - The clamped number.
     */
    math.clamp = (a,b,c)=>[a,b,c].sort()[1]
    /**
     * Return the log of one or two numbers.
     * @function
     * @param {number} base - The base of the log
     * @param {number} [val] - The value to effect.
     * @returns {number} n - The resulting exponant.
     */
    math.log = (a,b)=>typeof(b)=="number"?(Math.log(b)/Math.log(a)):Math.log(a)
    /**
     * Get a random value, optionally between two numbers.
     * @function
     * @param {number} [min] - The minimum limit of the random.
     * @param {number} [max] - The maximum limit of the random.
     * @returns {number} val - The random value.
     */
    math.random = (a,b)=>typeof(b)=="number"?
                    Math.round(Math.random()*(b-a)+a):
                        typeof(a)=="number"?
                        math.random(1,a):
                        Math.random()

    // Trig
    /** @todo write documentation for Trig functions */
    /** @function */
    math.sin = a=>Math.sin(a)
    /** @function */
    math.cos = a=>Math.cos(a)
    /** @function */
    math.tan = a=>Math.tan(a)
    /** @function */
    math.asin = a=>Math.asin(a)
    /** @function */
    math.acos = a=>Math.acos(a)
    /** @function */
    math.atan = (a,b)=>typeof(b)=="number"?Math.atan2(a,b):Math.atan(a)
    /** @function */
    math.deg = a=>a/Math.PI*180
    /** @function */
    math.rad = a=>a/180*Math.PI
    return mathObj;
}