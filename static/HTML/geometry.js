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

function interval_distance(interval1, interval2){
    if(interval1[1] < interval2[0])
        return interval2[0]-interval1[1];
    if(interval1[0] > interval2[1])
        return interval1[0] - interval2[1];
    return 0; //intersection
}

function distance(obj1, obj2){
    console.log("distance" ,obj1, obj2);
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


