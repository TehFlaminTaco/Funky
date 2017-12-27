var objects = require("../objects.js");
var strftime = require("../strftime.js");

function stream(stream_obj){
    var stream = objects.newList();
    stream.vars.on = function(d, prehook){
        var evnt = objects.newEvent();
        stream_obj.on(d, s=>{
            if (Buffer.isBuffer(s)){
                evnt.vars.call(s.toString())
            }else{
                evnt.vars.call(s)
            }
        });
        if(prehook){
            evnt.vars.hook(prehook);
        }
        return evnt;
    }
    stream.vars.write = function(s){
        stream_obj.write(s);
    }
    stream.vars.end = function(s){
        stream_obj.end(s);
    }
    stream.vars.pipe = function(other){
        if(other == undefined){
            return undefined;
        }else if(other.stream_obj){
            stream_obj.pipe(other.stream_obj);
        }else if(other.vars && other.vars.stdin && other.vars.stdin.stream_obj){
            stream_obj.pipe(other.vars.stdin.stream_obj);
            return other;
        }else{
            stream.vars.on('data', other);
            return stream;
        }
        return other;
    }
    stream.stream_obj = stream_obj;

    stream.type = 'Stream';

    return stream;
}

// Thanks StackOverflow
// https://stackoverflow.com/a/26426761/7170955
Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

// More stackoverflow
// https://stackoverflow.com/a/11888430/7170955
Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

module.exports = function(globals){
    var child_process = require("child_process")
    /**
     * The OS library. Contains a bunch of system functions.
     * @class os
     */
    var osObj = objects.newList();
    var os = osObj.vars;
    module.exports = ()=>osObj;
    var start = Date.now();

    /**
     * Get the current time in seconds with milisecond accuracy since the program began executing.
     * @function
     * @memberof os
     * @returns {number} time - The time lapsed in seconds
     */
    os.clock = function(){
        return (Date.now()-start)/1000;
    }
    
    /**
     * Get the current time in seconds.
     * @function
     * @memberof os
     * @returns {number} time - the current time in seconds
     */
    os.time = function(){
        return Date.now()/1000;
    }

    /**
     * Run a command from the command line and return an active process.
     * @function
     * @memberof os
     * @argument {string} command - The command to run or program to launch.
     * @argument {...string} [arguments] - Additional command line arguments.
     * @returns {Process} process - The newly running process
     */
    os.execute = function(command, ...args){
        var p = child_process.spawn(command, args, {shell: true})
        var obj = objects.newList();

        obj.type = 'Process'
        obj.vars.stdout = stream(p.stdout)

        obj.vars.stderr = stream(p.stderr)

        obj.vars.stdin = stream(p.stdin)

        obj.vars.pipe = (other)=>obj.vars.stdout.vars.pipe(other);
  
        obj.vars.on = stream(p)

        return obj;
    }

    /**
     * Return the time formatted with the C style strftime. Optionally accepts '*t' to return a table of the information.
     * @function
     * @memberof os
     * @param {string} format - The format to output in.
     * @param {number} time - Number of milliseconds since epoch for a particular time.
     * @returns {*} time - Output time
     */
    os.date = function(format, time){
        var timeArgs = {};
        var d;
        if(time==undefined){
            d = new Date();
        }else{
            d = new Date(time);
        }
        if(!format){
            return d.toString();
        }else if(format == '*t'){
            timeArgs = objects.newList();
            timeArgs.vars = {
                hour: d.getHours(),
                min: d.getMinutes(),
                wday: d.getDay(),
                year: d.getFullYear(),
                yday: d.getDOY(),
                month: d.getMonth(),
                sec: d.getSeconds(),
                day: d.getDate(),
                isdst: d.dst()
            };
            return timeArgs;
        }else{
            return strftime(format, d);
        }
    }

    return osObj
}