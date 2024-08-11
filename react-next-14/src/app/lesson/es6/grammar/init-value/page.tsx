export default function Page() {
    class Person {
        name!: string;
        previousName!: string;
    }

    const name = "John";
    //对象名与属性名相同，则可以省略属性名
    const initialValue: Person = {name, previousName: "before john"};

    return <div>
        {initialValue.name}<br/>
        {initialValue.previousName}
    </div>
}