export interface StudentProps {
    name: string,
    class: string
}

class Student {
    name: string
    class: string

    constructor(std: StudentProps) {
        this.name = std.name;
        this.class = std.class;
    }
}

export default Student