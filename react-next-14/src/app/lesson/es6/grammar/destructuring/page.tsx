interface Person {
    name: string;
    age?: number;// optional property 可选的属性
}

class Teacher implements Person {
    name!: string;//在类中可以定义非空断言
    age?: number;

    constructor(name: string, age?: number) {
        this.name = name;
        this.age = age;
    }
}

const zhang: Teacher = {name: 'harry'};
//解构并重命名
const {name: teacherName, age = 25} = zhang;
export default function Page() {
    console.log(teacherName);
    console.log(age);
    return <div>
        <h1>Destructuring</h1>
        TEACHER NAME:<br/>
        <p>{teacherName}</p>
    </div>
}