// ?: 可选属性
interface Person {
    name: string;
    age?: number;// optional property 可选的属性
}

class Student implements Person {
    name!: string;//在类中可以定义非空断言
    age?: number;
    constructor(name: string, age?: number) {
        this.name = name;
        this.age = age;
    }
}
const person1: Person = {name: 'harry'};
const person2: Student = {name: "必填", age: 18};

console.log('person1 = ', person1.name, person1.age);
console.log('person2 = ', person2.name, person2.age);

function optionalFun(name: string, age ?: number) {
    // 可选参数
    console.log("person = ", name, age)
}
optionalFun("clz", 13)
optionalFun("sad")

//?? 两个问题
// 判断变量是否为空，如果变量为空，用后面的默认值初始化对象。

const v1=null;
const v2=2;
const v3=v1??3;
const v4=v2??4;
console.log(v3,v4); // 3 2

//?.
//对象不为空才调用对象的属性。如果对象为空则返回undefined。
function getPersonName(person: Person | undefined) {
    return person?.name;
}

//相当于
function getPersonName2(person: Person | undefined) {
    if (person === undefined) {
        return undefined;
    }
    return person.name;
}

// ?: 其实是普通的三目运算符
const v11 = 1
const v22 = 2

const value = v11 > v22 ? "greater" : "less"









