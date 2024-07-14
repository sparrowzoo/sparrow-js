export default function Page() {
    return <>
        <div className="border border-red-700 h-[1200px]">
            <div className={"h-[1000px]"}></div>
            <p>Static parent</p>
            <div className="fixed bottom-0 left-0 border border-red-700 h-[100px] w-[400px] text-red-700 bg-black">
                <p>Absolute child</p>
            </div>

        </div>
    </>
}