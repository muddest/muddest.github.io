var regex = new RegExp('Apple');

var fruits = ["Banana", "Orange", "Apple", "Mango"];
var a = fruits.indexOf("Apple");
var b = fruits.indexOf(regex);


fruits.filter(function(word, index) {
    if(word.match(/[a-z]*pp[a-z]*/i)) {
        
    }
});