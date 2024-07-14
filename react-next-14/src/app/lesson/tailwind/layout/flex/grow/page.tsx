function Grow() {
    return <>
        <div className="flex flex-row-reverse rever border border-red-700">
            <div className="grow h-14 border border-red-700">
                01
            </div>
            <div className="grow-0 h-14 border border-red-700">
                默认是内容的宽度
            </div>
            <div className="grow h-14 border border-red-700">
                03
            </div>
        </div>
    </>
}

export default function Page() {
    return <>
        <Grow/>
    </>
}