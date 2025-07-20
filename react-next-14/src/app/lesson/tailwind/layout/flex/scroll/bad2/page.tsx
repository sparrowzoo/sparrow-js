export default function Page() {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-col h-screen">
                <header className="h-20">Header className="h-screen"</header>
                <a target="_blank" href="https://sparrowzoo.feishu.cn/wiki/JV9Zw3fnei3vZ3kvrRzcElUXnic"
                   className="flex-shrink-0">
                    https://sparrowzoo.feishu.cn/wiki/JV9Zw3fnei3vZ3kvrRzcElUXnic
                </a>
                <div className="flex-1 min-h-0 flex">
                    <div className={"w-full overflow-y-auto"}>
                        <div className="h-[2000px]">flex-1 min-h-0 flex</div>
                    </div>
                </div>
                <div className="flex-1 min-h-0">
                    <div className="overflow-y-auto">
                        <div className="h-[2000px]">flex-1 min-h-0 没有flex 没法滚</div>
                    </div>
                </div>
                <footer className="h-20">Footer</footer>
            </div>
        </div>
    )
}
