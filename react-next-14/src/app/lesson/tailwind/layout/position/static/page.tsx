export default function Page() {
    return <>
        <div className="static border border-red-700">
            <p>Static parent</p>
            <div className="absolute bottom-0 left-0 border border-red-700 h-[100px] w-[400px] text-red-700 bg-black">
                <p>Absolute child</p>
            </div>
        </div>
    </>
}