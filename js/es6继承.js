const createClass = function(child, parent) {
    
}

function parent(name, age) {
    this.name = name
    this.age = age
    this.p_name = 'parent'
}
parent.prototype.speakSomething = function() {
    console.log("I can speek chinese");
}

function child() {
    let _this = parent.apply(this, Array.from(arguments))
    console.log('-->', _this)
    this.c_name = 'child'
    return this
}
child.width = 18
child.prototype = Object.create(parent.prototype)
child.prototype.constructor = child
child.prototype.coding = function() {
    console.log("I can code JS");
}

var c = new child("job", 30)

