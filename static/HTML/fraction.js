// This needs to be at the end of the body,
// otherwise we don't have the div elements initialized
function style_to_num(style){
    return Number(style.substring(0,style.length-2));
}

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

function rect(obj){
    var rect_obj = {}
    var keys = ["left","top","width","height"];
    for(var i =0; i < keys.length;i++){
        rect_obj[keys[i]] = style_to_num(obj.style[keys[i]]);
    }
    return rect_obj;
}

function rect_positions(rect){
    var rect_pos = {};
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

function distance(obj1, obj2){
    var rect1 = rect(obj1);
    var rect2 = rect(obj2);
    var rpos1 = rect_positions(rect1);
    var rpos2 = rect_positions(rect2);
    var dist1 = interval_distance([rpos1.left, rpos1.right],
                                  [rpos2.left, rpos2.right] )
    var dist2 = interval_distance([rpos1.top, rpos1.bottom],
                                  [rpos2.top, rpos2.bottom])
    return max([dist1,dist2]);
}

function tag_change_color(tag, color) {
    tag.style.background = color;
}

function tag_revert_color(tag) {
    console.log("Reverting",tag.original_color);
    if (tag.original_color) {
        tag.style.background= tag.original_color;
    }
}

function tag_set_color(tag, color) {
    tag.original_color = color;
    tag.style.background = color;
}

function find_nearest(target) {
    var all_tags = document.getElementsByClassName("fraction");
    
    most_tags = filter(function(x) {
                          var val = (x === target || x.is_proto);
                          return !val; },
                       all_tags)
    nearest = min(most_tags, function(x){ return distance(x,target)}); 
    return nearest;
}

/* function: tag_orientation_dim
** input: tag, tag2, dim
** 
** Determines if tag is to the 'left' or 'right'
** or 'on top' of tag2, in the specified dimension.
*/
function tag_orientation_dim(tag, tag2, dim){
    var dims = {"left": "width",
                "top": "height"};
    console.log("1",tag[dim],tag[dims[dim]])
    console.log("2",tag2[dim],tag2[dims[dim]])
    var dist = interval_distance(
        [tag[dim], tag[dim] + tag[dims[dim]] ],
        [tag2[dim], tag2[dim] + tag2[dims[dim]] ]);
    console.log("dim",dim,dist);
    return dist;
}

function tag_setBottom(tag, new_bottom){
    tag_move(tag, tag.left, new_bottom-tag.height);
}

function tag_setTop(tag, new_top){
    tag_move(tag, tag.left, new_top);
}

function tag_setRight(tag, new_right){
    tag_move(tag, new_right-tag.width, tag.top);
}

function tag_setLeft(tag, new_left){
    tag_move(tag, new_left, tag.top);
}

function tag_snap_horizontal(tag, tag2){
    if(tag.left < tag2.left+tag2.width/2)
        tag_setRight(tag, tag2.left);
    else
        tag_setLeft(tag, tag2.left+tag2.width);
}

function tag_snap_adjacent(tag, tag2, dim){
    var dims = {"left": ["width", tag_setLeft, tag_setRight],
                "top": ["height", tag_setTop, tag_setBottom]};
    var extent = dims[dim][0];
    if(tag[dim] < tag2[dim] + tag2[extent]/2 ) {
        var setRight = dims[dim][2];
        setRight(tag, tag2[dim]);
    } else {
        var setLeft = dims[dim][1];
        setLeft(tag, tag2[dim] + tag2[extent]);
    }
}

function tag_snap_vertical(tag, tag2) {
    console.log(tag.top,tag2.top,tag2.height)
    if(tag.top < tag2.top + tag2.height/2 ) {
        console.log("setBottom");
        tag_setBottom(tag, tag2.top)
    }
    else
        tag_setTop(tag, tag2.top + tag2.height);
}

function tag_align_vertical(tag, tag2){
    tag_setTop(tag, tag2.top);
}

function tag_snap_to(tag, tag2) {
   console.log(tag.top)
   var left_dist = tag_orientation_dim(tag, tag2, "left");
   console.log("left_dist", left_dist);
   if(tag_orientation_dim(tag, tag2, "left") !== 0){
    
        console.log("aligning vertical");
        tag_align_vertical(tag, tag2);
        tag_snap_horizontal(tag, tag2);
        return;
    }
    
    // above or below
    tag_snap_vertical(tag, tag2);
}

function snap_to_nearest(target){
    nearest = find_nearest(target);
    console.log(nearest);
    if(!nearest) return;
    tag_snap_to(target, nearest[0]);
}

function movetarget(original_event){
    var original_x = original_event.clientX;
    var original_y = original_event.clientY;
    var target = original_event.target;

    var offset_x = -original_x+target.left;
    var offset_y = -original_y+target.top;

    var moveMe = function (event) {
        var x = event.clientX, y = event.clientY;
        tag_move(target, x + offset_x, y + offset_y);
    }
    var removeMe = function(event){
        document.removeEventListener("mousemove", moveMe);
        document.removeEventListener("mouseup", removeMe);
        
        snap_to_nearest(target);   
    }
    document.addEventListener("mousemove",moveMe);
    document.addEventListener("mouseup",removeMe);
    moveMe(original_event);
}

function tag_move(tag, new_left, new_top){
    tag.left = new_left;
    tag.top = new_top;
    tag.style.left = tag.left;
    tag.style.top = tag.top;
}

function tag_resize(tag, new_width, new_height){
    tag.width = new_width;
    tag.height = new_height;

    tag.style.width = tag.width;
    tag.style.height = tag.height;
}

function createFraction(pos, fraction_area, prototype){
    var newElement = document.createElement("div")

    newElement.className = prototype.className;
    newElement.onmousedown = movetarget;

    // Init position and getters
    
    tag_move(newElement, pos.clientX, pos.clientY);
    tag_resize(newElement,
                 style_to_num(window.getComputedStyle(prototype).width),
                 style_to_num(window.getComputedStyle(prototype).height));
    
    // Init color
    tag_set_color(newElement,
                  window.getComputedStyle(prototype).background);
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

