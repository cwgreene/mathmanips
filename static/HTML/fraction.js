// This needs to be at the end of the body,
// otherwise we don't have the div elements initialized
function style_to_num(style){
    return Number(style.substring(0,style.length-2));
}

function tag_change_color(tag, color) {
    tag.style.background = color;
}

function tag_revert_color(tag) {
    if (tag.original_color) {
        tag.style.background= tag.original_color;
    }
}

function tag_set_color(tag, color) {
    tag.original_color = color;
    tag.style.background = color;
}

function tag_find_nearest(tag) {
    var all_tags = document.getElementsByClassName("fraction");
    
    var most_tags = filter(function(x) {
                          var val = (x === tag || x.is_proto);
                          return !val; },
                       all_tags)
    var nearest = min(most_tags, function(x){ return distance(x,tag)}); 
    if(nearest && distance(nearest[0], tag) > 20){
        return undefined;
    }
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
    var dist = interval_distance(
        [tag[dim], tag[dim] + tag[dims[dim]] ],
        [tag2[dim], tag2[dim] + tag2[dims[dim]] ]);
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
    tag.adjacentRight = new_right;
    new_right.adjacentLeft = tag;
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

function linkAdjacent(left_tag, right_tag){
    left_tag.adjacentRight = right_tag;
    right_tag.adjacentLeft = left_tag;
}

function tag_snap_adjacent(tag, tag2, dim){
    var dims = {"left": ["width", tag_setLeft, tag_setRight],
                "top": ["height", tag_setTop, tag_setBottom]};
    var extent = dims[dim][0];
    if(tag[dim] < tag2[dim] + tag2[extent]/2 ) {
        var setRight = dims[dim][2];
        setRight(tag, tag2[dim]);
        linkAdjacent(tag, tag2);
    } else {
        var setLeft = dims[dim][1];
        setLeft(tag, tag2[dim] + tag2[extent]);
    }
}

function tag_snap_vertical(tag, tag2) {
    if(tag.top < tag2.top + tag2.height/2 ) {
        tag_setBottom(tag, tag2.top)
    }
    else
        tag_setTop(tag, tag2.top + tag2.height);
}

function tag_align_vertical(tag, tag2){
    tag_setTop(tag, tag2.top);
}

function tag_snap_to(tag, tag2) {
   var left_dist = tag_orientation_dim(tag, tag2, "left");
   if(tag_orientation_dim(tag, tag2, "left") !== 0){
    
        tag_align_vertical(tag, tag2);
        tag_snap_horizontal(tag, tag2);
        if(tag.left < tag2.left){
            linkAdjacent(tag, tag2);
        }
        else{
            linkAdjacent(tag2, tag);
        }
        return;
    }
    
    // above or below
    tag_snap_vertical(tag, tag2);
}

function tag_group_value(tag){
    var sum = new Rational(0,1);
    var cur_tag = tag;
    while(cur_tag.adjacentLeft){
        cur_tag = cur_tag.adjacentLeft;
    }
    while(cur_tag){
        sum = sum.add(cur_tag.value);
        console.log("summing:",sum);
        cur_tag = cur_tag.adjacentRight;
    }
    return sum;
}

function getTarget(){
    console.log(fraction_problem.target);
    return fraction_problem.target;
}

function tag_snap_to_nearest(tag){
    var nearest = tag_find_nearest(tag);
    if(!nearest) return;
    tag_snap_to(tag, nearest[0]);
    console.log(tag_group_value(tag));
    if(tag_group_value(tag).equals(getTarget())){
        destroy_fraction_group(tag);
        new_problem();
    }
}

function tag_disconnect(tag){
    if(tag.adjacentRight)
        tag.adjacentRight.adjacentLeft = undefined;
    if(tag.adjacentLeft)
        tag.adjacentLeft.adjacentRight = undefined;
    tag.adjacentRight = undefined;
    tag.adjacentLeft = undefined;
}

function movetarget(original_event){
    var original_x = original_event.clientX;
    var original_y = original_event.clientY;
    var target = original_event.target;

    var offset_x = -original_x+target.left;
    var offset_y = -original_y+target.top;

    var moveMe = function (event) {
        tag_disconnect(target);
        var x = event.clientX, y = event.clientY;
        tag_move(target, x + offset_x, y + offset_y);
    }
    var removeMe = function(event){
        document.removeEventListener("mousemove", moveMe);
        document.removeEventListener("mouseup", removeMe);
        
        tag_snap_to_nearest(target);   
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
    newElement.adjacent = undefined;

    // Init position and getters
    
    tag_move(newElement, pos.clientX, pos.clientY);
    tag_resize(newElement,
                 style_to_num(window.getComputedStyle(prototype).width),
                 style_to_num(window.getComputedStyle(prototype).height));
    newElement.value = new Rational(Number(newElement.width), 200);
    console.log("Value:",newElement.width, newElement.value);

    // Init color
    tag_set_color(newElement,
                  window.getComputedStyle(prototype).background);
    newElement.textContent = math_expr(rational_latex(newElement.value));
    MathJax.Hub.Typeset(newElement);
    fraction_area.appendChild(newElement);
    movetarget({"target":newElement, 
                "clientX":pos.clientX, 
                "clientY":pos.clientY});
   
    //fractions.fraction_area.push(newElement);
}

function destroyFraction(fraction){
    if(fraction.parentNode == null)
        return;
    fraction.parentNode.removeChild(fraction);
}

function destroy_fraction_group(fraction){
    var cur_fraction = fraction;
    while(cur_fraction.adjacentLeft){
        cur_fraction = cur_fraction.adjacentLeft;
    }
    while(cur_fraction){
        console.log(cur_fraction);
        var next = cur_fraction.adjacentRight;
        destroyFraction(cur_fraction);
        cur_fraction = next;
    }
}

function make_proto(proto_tag, fraction_area){
    proto_tag.is_proto = true;
    proto_tag.onmousedown = 
        function(event){ 
            createFraction(event, fraction_area, proto_tag)
        };
    proto_tag.numerator = 1;
    proto_tag.denominator = 1;
}

function init(){
    var fractionTags = document.getElementsByClassName("fraction");

    var fraction_area= document.getElementById("main_area");
    fraction_area.fractions = [];

    // Make all 'fraction' tags moveable.
    for(var i = 0; i < fractionTags.length; i++) {
        make_proto(fractionTags[i], fraction_area);
    }
}
init();
