var document;

var Eproblem_list = document.getElementById("Problems");
var Efraction_list = document.getElementById("Fractions");
var Epalette_list = document.getElementById("Palette");
var Enew_fraction_text = document.getElementById("NewFraction");
var Enew_pfraction_text = document.getElementById("NewPFraction");
var Estory = document.getElementById("Story");

var problem_dict = {};
var selected_fraction = undefined;
var pselected_fraction = undefined;

var display_problem = function (problem) {
    var i;
    while(Efraction_list.length > 0)
        Efraction_list.removeChild(Efraction_list.childNodes[0]);
    while(Epalette_list.length > 0)
        Epalette_list.removeChild(Epalette_list.childNodes[0]);
    for(i = 0; i < problem.fractions.length; i++) {
        add_fraction_option(problem.fractions[i]);
    }
    for(i = 0; i < problem.palette.length; i++) {
        add_pfraction_option(problem.palette[i]);
    }
    Estory.value = problem.story;
}

var new_sequence_problem = function () {
    var max = 0;
    var i;
    console.log(Eproblem_list);
    for(i = 0; i < Eproblem_list.childNodes.length; i++) {
        var cur_val = Eproblem_list.childNodes[i];
        if(cur_val.tagName !== "OPTION")
            continue;
        cur_val = Number(cur_val.value);
        if(max < cur_val)
            max = cur_val;
    }
    new_problem_option({"id":max+1,story:"",fractions:[]});
}

var add_option = function (element, text, onclick) {
    var new_option = document.createElement("option");
    new_option.textContent = text;
    new_option.value = text;
    if(onclick)
        new_option.onclick = onclick;
    element.appendChild(new_option);
}

var add_fraction_option = function (frac) {
    add_option(Efraction_list, frac, function (){selected_fraction = this});
}

var delete_fraction = function () {
    Efraction_list.removeChild(selected_fraction);
}

var new_fraction_option = function () {
    var frac = Enew_fraction_text.value;
    add_fraction_option(frac);
}

var delete_pfraction = function () {
    Epalette_list.removeChild(selected_pfraction);
}

var add_pfraction_option = function (frac) {
    add_option(Epalette_list, frac, function (){selected_pfraction = this});
}

var new_pfraction_option = function () {
    var frac = Enew_pfraction_text.value;
    add_pfraction_option(frac);
}

var join = function (sep, alist) {
    var result = "";
    for(var i = 0; i < alist.length; i++) {
        result += alist[i];
        if(i != alist.length-1)
            result += ",";
    }
    return result;
}

var get_option_list = function (element) {
    var result = [];
    for(var i = 0; i < element.childNodes.length; i++) {
        var node = element.childNodes[i];
        if(node.tagName=="OPTION")
            result.push(node.textContent);
    }
    console.log(result);
    return join(",", result);
}

var count = 0;
var post_problem = function () {
    //Get selected sequence_id;
    sequence_id = Eproblem_list.value;
    fractions = get_option_list(Efraction_list);
    palette = get_option_list(Epalette_list);
    story = Estory.value;

    console.log(fractions);
    result_str = ("sequence_id="+sequence_id+
                  "&fractions="+encodeURIComponent(fractions)+
                  "&story="+encodeURIComponent(story)+
                  "&palette="+encodeURIComponent(palette))
    console.log(result_str)
    post_request("/admin", 
                 result_str, 
                 function (response) {
                    console.log("Response:", response);
                    alert("success!");
                    get_request("/problems", "", update_problems);
                 },
                 function(response) {
                    alert("Failure!");
                 });
}

var update_problem_select = function (problem_dict) {
}

var new_problem_option = function (problem) {
   add_option(Eproblem_list, 
        ""+problem.id, 
        function (ev) { 
                display_problem(problem) 
        });
}

var update_problems = function (response) {
    response = JSON.parse(response);
    console.log(response);
    var problems = response.problems;
    // Remove old problems
    while(Eproblem_list.childNodes.length > 0) {
        Eproblem_list.removeChild(Eproblem_list.childNodes[0]);
    }
    // Add new problems.
    for(var i = 0; i < problems.length; i++) {
        var problem = problems[i];
        new_problem_option(problem);
        problem_dict[problem.id] = problem;
    }
}

get_request("problems", "", update_problems);

//var problems: defined in admin.html
//populate_problem_list(problems);
