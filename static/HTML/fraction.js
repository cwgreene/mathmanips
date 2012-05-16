// This needs to be at the end of the body,
// otherwise we don't have the div elements initialized
function style_to_num(style){
    return Number(style.substring(0,style.length-2));
}

function min(alist, key){
    if(!key){
        key = function(x){
            return x;
        }
    }
    if(alist.length === 0)
        return;
    var min = alist[0];
    var min_key = key(alist[0])
    for(var i = 0; i < alist.length; i++) {
        i_key = key(alist[i])
        if(min_key > i_key){
            min = alist[i];
            min_key = i_key;
        }
    }
    return min;
}
function max(alist){
    return min(alist, key=function(x){return -x})
}

function rect(obj){
    rect_obj = {}
    keys = ["left","top","width","height"];
    for(var i =0; i < keys.length;i++){
        rect_obj[keys[i]] = style_to_num(obj.style[keys[i]]);
    }
    return rect_obj;
}

function rect_positions(rect){
    rect_pos = {};
    rect_pos.left = rect.left;
    rect_pos.top = rect.top;
    rect_pos.bottom = rect.top + rect.height;
    rect_pos.right = rect.left + rect.width;
    return rect_pos;
}

function restrict(obj, keys){
    var ret = []
    for(key in keys){
        ret.push = obj[key]
    }
    return ret;
}

function interval_distance(interval1, interval2){
    if(interval1[1] < interval2[0])
        return interval2[0]-interval1[1];
    if(interval1[0] > interval2[1])
        return interval1[0] - interval2[1];
    return 0; //intersection
}

function map(f, alist){
    var ret = [];
    for(var i = 0; i < alist.length;i++){
        ret.push(f(alist[i]));
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

function distance(obj1, obj2){
    var rect1 = rect(obj1);
    var rect2 = rect(obj2);
    var rpos1 = rect_positions(rect1);
    var rpos2 = rect_positions(rect2);
    var restrict_mult
    var dist1 = interval_distance([rpos1.left, rpos1.right],
                                  [rpos2.left, rpos2.right] )
    var dist2 = interval_distance([rpos1.top, rpos1.bottom],
                                  [rpos2.top, rpos2.bottom])
    return max([dist1,dist2]);
}

function tag_change_color(tag, color) {
    if (tag.original_color === undefined || tag.original_color === "") {
        tag.original_color = tag.style.background;
    }
    tag.style.background = color;
}

function tag_revert_color(tag) {
    console.log("Reverting",tag.original_color);
    if (tag.original_color) {
        tag.style.background= tag.original_color;
    }
}

function find_nearest(x, y, target, threshhold) {
    var all_tags = document.getElementsByClassName("fraction");

    for(var i = 0 ; i < all_tags.length; i++) {
        var tag = all_tags[i];
        if(tag === target || tag.is_proto) {
            continue;
        }
        var tag_x = style_to_num(tag.style.left);
        var tag_y = style_to_num(tag.style.top);
        console.log("distance",distance(target,tag));
        if(distance(target,tag) < threshhold) {
            tag_change_color(tag,"yellow")
        }else {
            tag_revert_color(tag);
        }       
    }
}

function movetarget(original_event){
    var original_x = original_event.clientX;
    var original_y = original_event.clientY;
    var target = original_event.target;

    var offset_x = -original_x+style_to_num(target.style.left);
    var offset_y = -original_y+style_to_num(target.style.top);

    var moveMe = function (event) {
        var x = event.clientX, y = event.clientY;
        target.style.left = x + offset_x;
        target.style.top = y + offset_y;
        var nearest = find_nearest(x, y, target, 10);
    }
    var removeMe = function(event){
        document.removeEventListener("mousemove", moveMe);
        document.removeEventListener("mouseup", removeMe);
    }
    document.addEventListener("mousemove",moveMe);
    document.addEventListener("mouseup",removeMe);
    moveMe(original_event);
}

function createFraction(pos, fraction_area, prototype){
    var newElement = document.createElement("div")
    newElement.className = prototype.className;
    newElement.onmousedown = movetarget;
    newElement.style.left = pos.clientX + "px";
    newElement.style.top = pos.clientY + "px";
    newElement.style.width = window.getComputedStyle(prototype).width;
    newElement.style.height = window.getComputedStyle(prototype).height;
    newElement.style.background = window.getComputedStyle(prototype).background;
    console.log(prototype.textContent);
    newElement.textContent = prototype.textContent;
    fraction_area.appendChild(newElement);
    movetarget({"target":newElement, 
                "clientX":pos.clientX, 
                "clientY":pos.clientY});
}
function init(){
    var fractionTags = document.getElementsByClassName("fraction");

    var fraction_area=document.getElementById("main_area");

    // Make all 'fraction' tags moveable.
    for(var i = 0; i < fractionTags.length; i++) {
        fractionTags[i].is_proto = true;
        fractionTags[i].onmousedown=function(target){
            return function(event){
                createFraction(event,fraction_area, target);
            }}(fractionTags[i]);
    }
}
init();

