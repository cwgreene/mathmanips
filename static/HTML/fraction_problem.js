//requires: util.js

var fraction_problem = {};

var rational_latex = function(rat){
        if(rat.equals(new Rational(1,1)))
            return "1";
        return "\\frac{"+rat.num+"}{"+rat.den+"}";
}

var rand_int = function(n){
    return Math.floor(Math.random()*(n+1));
}

//match(list1, list2, equals)
var array_equivalent = function(list1, list2){
    return list_match_equals(list1, list2);
}

var validate_verbatim = function(problem_statement, fraction_tags){
    var fraction_groups = connected_components(fraction_tags);
    //return filter(fraction_groups, are_to(array_equivalent, problem_statement));
    for(var i = 0; i < fraction_groups; i++)
    {
        var fraction_group = fraction_groups[i];
        if(array_equivalent(problem_statement, fraction_group))
            return true;
    }
    return false;
}

var validate = function(fraction_tags){
    validate_verbatim(fraction_problem.statement, fraction_tags);
    validate_unicolor(fraction_tags);
}

var cur_problem = 0;
var new_problem = function(){
    var list_problems = [[new Rational(1,4),new Rational(1,5)],
                         [new Rational(3,4),new Rational(1,2)],
                         [new Rational(1,2),new Rational(1,4), new Rational(1,5)]];
    cur_problem +=1;
    var current = list_problems[cur_problem%list_problems.length];
    FractionProblem(current, document.getElementById("problem"), fraction_problem); 
}

var math_expr = function(expr){
    return "$"+expr+"$";
}

var FractionProblem = function(rational_list, target_tag, target_var){
    var fraction_strings = [];
    var sum = new Rational(0,1);
    for(var i = 0; i < rational_list.length; i++){
        var rat = rational_list[i];
        console.log(rat);
        fraction_strings[i] = rational_latex(rat);
        sum = sum.add(rat);
    }
    var str_sum = fraction_strings.join("+");
    target_tag.textContent = "$"+str_sum+"$";
    MathJax.Hub.Typeset(target_tag);
    target_var.target = sum;
    target_var.problem_statement = rational_list;
}

var init_problem = function(){
    var problem = document.getElementById("problem");
    new FractionProblem([new Rational(1,2), new Rational(1,4)], problem, fraction_problem);
}

init_problem()
