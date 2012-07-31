var request = function(resource, method, data, action, error_action) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () { 
        if(this.readyState==4 && this.status == 200) {
            action(this.response);
        }else if(this.readyState==4) {
            error_action(this.response, this.status);
        }

    };
    req.open(method, resource);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log(data);
    req.send(data);
}

var get_request = function(resource, data, action, error_action) {
    request(resource, "GET", data, action, error_action);
}

var post_request = function(resource, data, action, error_action) {
    request(resource, "POST", data, action, error_action);
}
