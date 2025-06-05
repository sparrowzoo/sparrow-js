interface RunDemo {
    demo: string,
    readonly '~run': (
        p: string
    ) => string;
}

const runDemo = {
    demo: "hello",
    '~run'(p: string) {
        return this.demo + p;
    }
}
export default runDemo;
