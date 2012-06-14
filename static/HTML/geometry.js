var rect = function(obj){
    var rect_obj = {}
    var keys = ["left","top","width","height"];
    for(var i =0; i < keys.length;i++){
        rect_obj[keys[i]] = style_to_num(obj.style[keys[i]]);
    }
    return rect_obj;
}

var rect_positions = function(rect) {
    var rect_pos = {};
    rect_pos.left = rect.left;
    rect_pos.top = rect.top;
    rect_pos.bottom = rect.top + rect.height;
    rect_pos.right = rect.left + rect.width;
    return rect_pos;
}

var interval_distance = function(interval1, interval2){
    if(interval1[1] < interval2[0])
        return interval2[0]-interval1[1];
    if(interval1[0] > interval2[1])
        return interval1[0] - interval2[1];
    return 0; //intersection
}

var distance = function(obj1, obj2){
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

var do_rects_intersect = function(rect1, rect2) {
    //Negate the situations where it's to the left,
    //Directly above, directly below, or to the right
    return !(  (rect1.left+rect1.width < rect2.left
            || (rect1.left > (rect2.left + rect2.width) ) 
            || (rect1.top > rect2.top+rect2.height)
            || ((rect1.top + rect1.height) < rect2.top)));
}

var point_in_interval = function(pos, interval) {
    return (pos >= interval[0] && pos <= interval[1])
}

var point_in_rect = function(point, rect) {
    return (point_in_interval(point.x, [rect.left, rect.left + rect.width]) &&
            point_in_interval(point.y, [rect.top, rect.top + rect.height]));
}
