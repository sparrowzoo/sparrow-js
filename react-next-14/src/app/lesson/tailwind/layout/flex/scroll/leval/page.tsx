export default function Page() {
    return (<div className="h-fit">
            <h2>hello</h2>
            <div className="h-[calc(100vh-80px)] flex flex-col">
                <header className="h-20">Header</header>
                <div className="flex-1 min-h-0 flex">
                    <div className={"w-full overflow-y-auto"}>
                        <div className="h-[2000px]">flex-1 min-h-0 overflow-y-auto</div>
                    </div>
                </div>
                <footer className="h-20">Footer</footer>
            </div>
        </div>
    )
}
