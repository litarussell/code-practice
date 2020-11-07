class Parent {
    static p = 0
    p_name = 'parent'
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    speakSomething(){
        console.log("I can speek chinese");
    }
}

class Child extends Parent {
    static width = 18
    c_name = 'child'
    constructor(name,age){
        super(name,age);
    }
    coding(){
        console.log("I can code JS");
    }
}

var c = new Child("job",30);
