var request = function(resource, method, data, action) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () { 
        if(this.readyState==4) 
            action(this.response);
    };
    req.open(method, resource);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log(data);
    req.send(data);
}

var get_request = function(resource, data, action) {
    request(resource, "GET", data, action);
}

var post_request = function(resource, data, action) {
    request(resource, "POST", data, action);
}
