module.exports = function(globals){
    var objects = require("../objects.js");
    /**
     * The Table library. Objects are defautly parented to this.
     * @class table
     */
    var tableObj = objects.newList();
    var table = tableObj.vars;
    module.exports = ()=>tableObj;

    /**
     * Get the value of an object, ignoring metamethods and similar.
     * @function
     * @memberof table
     * @param {Object} table - The object to look in.
     * @param {string} key - The key to use.
     * @returns {*} value - The value of table[key].
     */
    table.rawGet = function(t, name){
        return t.vars[name];
    }
    /**
     * Set the key of an object to a value, ingoring metamethods and events.
     * @function
     * @memberof table
     * @param {Object} table - The object to modify
     * @param {string} key - The key to use.
     * @param {*} value - The value to set table[key] to.
     * @returns {*} value - The new value.
     */
    table.rawSet = function(t, name, val){
        return t.vars[name] = val;
    }
    /**
     * Use a table as the arguments to a function.
     * @function
     * @memberof table
     * @param {Object} table - The object to use.
     * @param {function} func - The function to apply to.
     * @returns {*} val - The return value of the function call.
     */
    table.apply = function(t, fn){
        var asList = [];
        for(var s in t.vars){
            asList[s] = t.vars[s]
        }
        return fn.apply(undefined, asList)
    }
    /**
     * Return an object with all numbered keys in reversed order to the input.
     * @function
     * @memberof table
     * @param {Object} table - The object to reverse.
     * @returns {Object} reversed - The reversed object.
     */
    table.reverse = function(t){
        var len = globals.math.vars.len
        var inplen = len(t)
        var out = objects.newList()
        for(var i=inplen-1; i>=0; i--){
            out.vars[len(out)] = t.vars[i]
        }
        return out
    }
    /**
     * Insert a value into a table.
     * @function
     * @memberof table
     * @param {Object} table - The table to modify.
     * @param {number} [index] - Where to insert the new value. Defaults to the end of the table.
     * @param {*} val - The value to insert.
     * @returns {Object} table - The modified input table.
     */
    table.insert = function(t, index, value){
        var ln = math.len(t)
        if(value==undefined){
            value = index
            index = ln
        }
        if(index==undefined){
            index = math.len(t);
        }
        for(var i=ln; i>index; i--){
            t.vars[i] = t.vars[i-1]
        }
        t.vars[index] = value;
        return t;
    }
    /** 
     * @function
     * @memberof table
     * @see table.insert
     */
    table.push = table.insert
    /**
     * Remove a value from an object at a particular index, moving entires after it to fit.
     * @function
     * @memberof table
     * @param {Object} table - The object to modify.
     * @param {number} [index] - The index of the table to remove. Defaults to the last value of the table.
     * @returns {*} popped - The value removed from the table.
     */
    table.remove = function(t, index){
        var ln = math.len(t)
        if(index == undefined){
            index = ln-1
        }
        var out = t.vars[index]
        for(var i=index; i<ln; i++){
            t.vars[i] = t.vars[i+1]
        }
        delete t.vars[ln-1]
        return out
    }
    /**
     * @function
     * @memberof table
     * @see table.remove
     */
    table.pop = table.remove

    /**
     * Get the size of an object.
     * @function
     * @memberof table
     */
    table.len = t=>math.len(t)
    /**
     * Rotate an object, preserves all elements.
     * @function
     * @memberof table
     * @param {Object} table - The object to rotate.
     * @param {number} [n=1] - The amount to rotate. May be negative, defaults to 1.
     * @returns {Object} table - The now modified input table.
     */
    table.rotate = (t, n)=>{
        n = n || 1;
        while(n>0){
            table.insert(t,0,table.pop(t));
            n--;
        }
        while(n<0){
            table.insert(t,table.remove(t,0));
            n++;
        }
        return t;
    }

    /**
     * Append a table to the end of another.
     * Non-objects will be implicitly wrapped in an object.
     * @function
     * @memberof table
     * @param {Object|*} target - The object to append elements to.
     * @param {Object|*} source - The object in which to get elements from.
     * @returns {Object} combined - All of target's elements, followed by source's elements. Modifies target.
     */
    table.add = function(t,b){
        if(typeof(t)!="object"){
            var nT = objects.newList();
            nT.vars[0] = t;
            t = nT
        }
        if(typeof(b)!="object"){
            var nB = objects.newList();
            nB.vars[0] = b;
            b = nB
        }
        for(var i=0; i < table.len(b); i++){
            table.push(t,b.vars[i]);
        }
        return t;
    }

    /**
     * Replace all elements of target with elements of source where source has elements.
     * @function
     * @memberof table
     * @param {Object} target - The target object.
     * @param {Object} source - Where to copy elements from.
     * @returns {Object} target - The now modified input.
     */
    table.merge = function(t,b){
        for(var name in b.vars){
            t.vars[name] = b.vars[name]
        }
        return t;
    }

    /** @function
     * @memberof table */
    table.clone = function(t){
        var newT = objects.newList()
        for(var name in t.vars){
            if(typeof(t.vars[name])=="object"){
                newT.vars[name] = table.clone(t.vars[name]);
            }else{
                newT.vars[name] = t.vars[name]
            }
        }
        return newT
    }

    /**
     * Create a clone of an object, applying a function to all entries.
     * @function
     * @memberof table
     * @param {Object} table - The table to clone
     * @param {function} mapping - The function to map over.
     * @returns {Object} modified - The mapped table.
     */
    table.map = function(t, fun){
        var newT = objects.newList();
        for(var name in t.vars){
            newT.vars[name] = fun(t.vars[name], name)
        }
        return newT
    }

    /** @function
     * @memberof table */
    table.sublist = function(t,ind,len){
        ind = ind || 0;
        len = len || math.len(t)-ind;
        var outList = objects.newList();
        var c = 0;
        for(var i=ind; i<(ind+len); i++){
            outList.vars[c++] = t.vars[i];
        }
        return outList;
    }

    /** @function
     * @memberof table */
    table.sort = function(t,f){
        var t_len = math.len(t);
        var pivot = Math.floor(Math.random()*t_len)
        var pivotVal = t.vars[pivot];
        var left = objects.newList();
        var right = objects.newList();
        var l_i = 0;
        var r_i = 0;
        f = f || math.lt;
        for(var i=0; i<t_len; i++){
            if(i!=pivot){
                if(f(t.vars[i], pivotVal)){
                    left.vars[l_i++] = t.vars[i];
                }else{
                    right.vars[r_i++] = t.vars[i];
                }
            }
        }
        if(l_i>1)
            left = table.sort(left, f);
        if(r_i>1)
            right = table.sort(right, f);
        return table.add(table.add(left, pivotVal),right)
    }

    /** @function
     * @memberof table */
    table.reduce = function(t, f){
        var o = t.vars[0]
        var tl = math.len(t);
        for(var i=1; i<tl; i++){
            o = f(o, t.vars[i])
        }
        return o;
    }

    /** @function
     * @memberof table */
    table.fold = function(t, f){
        var o = objects.newList();
        var tl = math.len(t);
        for(var i=1; i<tl; i++){
            o.vars[i-1] = f(t.vars[i-1], t.vars[i])
        }
        return o;
    }

    /** @function
     * @memberof table */
    table.cumulate = function(t, f){
        var o = objects.newList();
        var v = t.vars[0];
        o.vars[0] = v;
        var tl = math.len(t);
        for(var i=1; i<tl; i++){
            v = f(v, t.vars[i])
            o.vars[i] = v;
        }
        return o;
    }

    return tableObj
}