const createClass = function(subClass, superClass) {
    // TODO
    subClass.prototype = Object.create(superClass.prototype)
    subClass.prototype.constructor = subClass

    // Object.setPrototypeOf(subClass, superClass)
    subClass.__proto__ = superClass

    return subClass;
}

function superClass() {
    this.superName = 'super';
}
superClass.superStatic = 'super'
superClass.prototype.superValue = 'super'

function subClass() {
    this.subName = 'sub';
}

let sub = createClass(subClass, superClass)

subClass.prototype.subValue = 'sub'
