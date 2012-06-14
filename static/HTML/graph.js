/* Graph
 *
 * Edge list representation for a graph.
 * 
 * Methods:
 * size
 * add_node
 * */
Array.prototype.equals = function(y){
    if(this.length !== y.length)
        return false;
    for(var i in this){
        if(this[i] !== y[i])
            return false;
    }
    return true;
}

var Graph = function(){
    this.p_nodes = {}; // Edge list
}

Graph.prototype.size = function(){
    return Object.keys(this.p_nodes).length;
}

Graph.prototype.nodes = function(){
    return Object.keys(this.p_nodes);
}

Graph.prototype.add_node = function(node_name){
    if(typeof node_name != "string"){
        //throw("Only string names are allowed for nodes");
    }
    this.p_nodes[node_name] = [];
}

Graph.prototype.adjacent = function(node_name){
    if(!(node_name in this.p_nodes))
        throw("Graph.prototype.adjacent: " + node_name + " not in graph");
    return this.p_nodes[node_name];
}

Graph.prototype.connect = function(a, b){
    if(!(a in this.p_nodes && b in this.p_nodes))
        throw("Graph.prototpe.connect: " + a + " and " + b + " not both in graph");
    return this.p_nodes[a].push(b);
}

Graph.prototype.connected = function(node){
    console.log(node in this);
    console.log(this.nodes());
    alist = [node];
    found = {};
    while(!alist.equals([])){
        cur = alist.pop();
        var adjacent = this.adjacent(cur);
        for(var i = 0; i < adjacent.length; i++) {
            if(adjacent[i] in found)
                continue;
            found[adjacent[i]] = true;
            alist.push(adjacent[i]);
        }
    }
    return Object.keys(found);
}

function test(){

var assert_failures = [];
var assert = function(string, string2){
    var assert_val = eval(string + string2);
    console.log((string+string2) + " : ", assert_val);
    if(assert_val !== true){
        assert_failures.push([string+string2, eval(string)]);
    }
}


var test = function(){
    var init = "var x = new Graph();"
    assert(init + "x.size()", "=== 0");
    assert(init + "x.nodes()", ".equals([])");

    var init2 = init + "x.add_node('a');";
    assert(init2 + "x.size()"," === 1");
    assert(init2 + "x.nodes()",".equals(['a'])");
    assert(init2 + "x.adjacent('a')",".equals([])");

    var init3 = init2 + "x.add_node('b');";
    assert(init3 + "x.size()"," === 2;")
    assert(init3 + "x.connect('a','b'); x.adjacent('a')",".equals(['b'])")
    assert(init3 + "x.connect('a','b'); x.adjacent('b')",".equals([]);")
    assert(init3 + "x.connect('b','a'); x.adjacent('b')",".equals(['a']);")
    assert(init3 + "x.connect('b','a'); x.adjacent('a')",".equals([]);")
    
    var init4 = init3 + "x.add_node('c'); x.connect('a','b'); x.connect('b','c');";
    assert(init4 + "x.connected('a')", ".equals(['b','c'])");
    
    var init5 = init4 + "x.connect('b','a'); x.connect('c','b');";
    assert(init5 + "x.connected('a')", ".equals(['b','c','a'])");

    assert("var x = new Graph(); x.add_node(1); x.nodes()",".equals(['1'])");

    console.log("Failures:",assert_failures.length);
    if(assert_failures.length)
        console.log( assert_failures);
}

test() 
}
test()
