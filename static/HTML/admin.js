var Eproblem_list = document.getElementById("Problems");
var Efraction_list = document.getElementById("Fractions");

var add_option = function(element, text) {
    var new_option = document.createElement("option");
    new_option.textContent = text;
    new_option.value = text;
    element.appendChild(new_option);
}

var populate_problem_list = function(problem_list) {
    for(var i = 0; i < problem_list.length; i++) {
        add_option(Eproblem_list, problem_list[i]);
    }
}

var request = function(resource, method, data, action) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () { 
        if(this.readyState==4) 
            action(this.response);
    };
    req.open(method, resource);
    req.send(data);
}

var get_request = function(resource, data, action) {
    request(resource, "GET", data, action);
}

var post_request = function(resource, data, action) {
    request(resource, "POST", data, action);
}

get_request("test.json", "", console.log);

//var problems: defined in admin.html
//populate_problem_list(problems);
