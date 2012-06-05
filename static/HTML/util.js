function min(alist, akey){
    if(!akey){
        var key = function(x){
            return x;
        }
    }else {
        var key = akey;
    }
    if(alist.length === 0)
        return;
    var min = alist[0];
    var min_key = key(alist[0])
    for(var i = 0; i < alist.length; i++) {
        var i_key = key(alist[i])
        if(min_key >= i_key){
            min = alist[i];
            min_key = i_key;
        }
    }
    if(!akey)
        return min;
    return [min, min_key]
}

function max(alist){
    return min(alist, key=function(x){return -x})[0]
}

function restrict(obj, keys){
    var ret = []
    for(key in keys){
        ret.push = obj[key]
    }
    return ret;
}

function map(f, alist){
    var ret = [];
    for(var i = 0; i < alist.length;i++){
        ret.push(f(alist[i]));
    }
    return ret;
}

function filter(f, alist){
    var ret = []
    var j = 0;
    for(var i = 0; i < alist.length;i++){
        if (f(alist[i])){
            ret[j] = alist[i];
            j += 1;
        }
    }
    return ret;
}

function zip(alist, blist) {
    var ret = [];
    var length = min(alist,blist);
    for(var i = 0; i < length;i++)
    {
        ret[i] = [alist[i], blist[i]];
    }
    return ret;
}


function map_args(f, args, alist){
    var undefined_index = 0;
    for(var i = 0; i < args.length; i++){
        if(args[i] === undefined){
            break;
        }
        i+=1;
    }
    var g = function(x) {
        args[undefined_index] = x;
        f.apply(this,args);
    }
    return map(g, alist);
}

function apply(f, alist){
    f.apply(this, alist);
}

