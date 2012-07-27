var gcd = function(a,b){
    if(a==0)
        return b;
    return gcd(b%a, a);
}

var Rational = function(num, den){
    this.den = den/gcd(den, num);
    this.num = num/gcd(den, num);

    if(num == 0)
        this.den = 1;
}

Rational.prototype.add = function(frac) {
    return new Rational(this.num*frac.den+frac.num*this.den, frac.den*this.den);
}

Rational.prototype.equals = function(frac){
    return this.num == frac.num && this.den == frac.den;
}

Rational.prototype.mult = function(frac) {
    return new Rational(this.num*frac.num, frac.den*this.den);
}

var str2rational = function(str) {
    var split = str.split("/")
    var num = split[0];
    var denom = split[1];
    if(!(num) || !(denom))
        return new Rational(0,1);
    return new Rational(Number(num),Number(denom));
}


/* Tests */
function test(){

var assert_failures = [];
var assert = function(string){
    var assert_val = eval(string);
    console.log(string + " : ", assert_val);
    if(assert_val != true){
        assert_failures.push([string, assert_val]);
    }
}

var test = function(){
    //gcd
    assert("gcd(3,1) == 1");
    assert("gcd(-2, 6) == -2");
    assert("gcd(2,3) == 1");
    assert("gcd(-2,-1) == -1");
    assert("gcd(2, 6) == 2");
    assert("gcd(6,12) == 6");
    assert("gcd(8,12) == 4");
    assert("gcd(2*3*5*7, 3*5*7) == (3*5*7)");
    
    //Rational
    assert("var one_half = new Rational(1,2);"+
           "var one = new Rational(1, 1); "+
           "one_half.add(one_half).equals(one)");

    assert("var zero1 = new Rational(0,2);"+
           "var zero2 = new Rational(0, 1); "+
           "zero1.equals(zero2);");
    assert("var one_third = new Rational(1,3);" +
           "var m_one_third = new Rational(-1,3);" +
           "var zero = new Rational(0,1);" + 
           "one_third.add(m_one_third).equals(zero)");
    assert("(new Rational(2,3)).equals(new Rational(3,2)) == false");
    assert("(new Rational(1,2)).mult(new Rational(1,2)).equals(new Rational(4,16))");      
    assert("(new Rational(1,3)).add(new Rational(3,1)).equals(new Rational(10,3))");      
    assert("(new Rational(3,5)).add(new Rational(5,3)).equals(new Rational(34,15))");
    assert("(new Rational(1,2)).add(new Rational(1,4)).equals(new Rational(3,4))");
    assert("(new Rational(1,4)).add(new Rational(1,2)).equals(new Rational(3,4))");
    console.log(assert_failures);
}
return test();

}
test()
