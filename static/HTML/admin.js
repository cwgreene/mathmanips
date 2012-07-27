var Eproblem_list = document.getElementById("Problems");
var Efraction_list = document.getElementById("Fractions");
var Enew_fraction_text = document.getElementById("NewFraction");
var Estory = document.getElementById("Story");
var problem_dict = {};

var display_problem = function(problem) {
    while(Efraction_list.length != 0)
        Efraction_list.removeChild(Efraction_list.childNodes[0]);
    for(var i = 0; i < problem.fractions.length; i++) {
        add_option(Efraction_list, problem.fractions[i]);
    }
    Estory.value = problem.story;
}

var new_sequence_problem = function() {
    var max = 0;
    console.log(Eproblem_list);
    for(var i = 0; i < Eproblem_list.childNodes.length; i++) {
        var cur_val = Eproblem_list.childNodes[i];
        if(cur_val.tagName !== "OPTION")
            continue;
        cur_val = Number(cur_val.value);
        if(max < cur_val)
            max = cur_val;
    }
    new_problem_option({"id":max+1,story:"",fractions:[]});
}

var add_option = function(element, text, onclick) {
    var new_option = document.createElement("option");
    new_option.textContent = text;
    new_option.value = text;
    if(onclick)
        new_option.onclick = onclick;
    element.appendChild(new_option);
}

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

var new_fraction_option = function() {
    var frac = Enew_fraction_text.value;
    add_option(Efraction_list, frac);
}

var get_request = function(resource, data, action) {
    request(resource, "GET", data, action);
}

var post_request = function(resource, data, action) {
    request(resource, "POST", data, action);
}

var join = function(sep, alist) {
    var result = "";
    for(var i = 0; i < alist.length; i++) {
        result += alist[i];
        if(i != alist.length-1)
            result += ",";
    }
    return result;
}

var get_option_list = function(element) {
    var result = [];
    for(var i = 0; i < element.childNodes.length; i++) {
        var node = element.childNodes[i];
        if(node.tagName=="OPTION")
            result.push(node.textContent);
    }
    console.log(result);
    return join(",", result);
}

var post_problem = function() {
    //Get selected sequence_id;
    sequence_id = Eproblem_list.value;
    fractions = get_option_list(Efraction_list);
    story = Estory.value;

    console.log(fractions);
    result_str = ("sequence_id="+sequence_id+
                  "&fractions="+encodeURIComponent(fractions)+
                  "&story="+encodeURIComponent(story))
    console.log(result_str)
    post_request("/admin", result_str, function(){console.log("success")});
}

var update_problem_select = function(problem_dict) {
}

var new_problem_option = function(problem) {
   add_option(Eproblem_list, 
        ""+problem.id, 
        function (ev) { 
                display_problem(problem) 
        });
}

var update_problems = function(response) {
    response = JSON.parse(response);
    console.log(response);
    var problems = response.problems;
    // Remove deleted problems
    //
    // Add new problems.
    for(var i = 0; i < problems.length; i++) {
        var problem = problems[i];
        if(!( problem.id in problem_dict))
            new_problem_option(problem);
        problem_dict[problem.id] = problem;
    }
}

get_request("problems", "", update_problems);

//var problems: defined in admin.html
//populate_problem_list(problems);
