
export default function Page() {
    return (
        <>
            <p className={"flex"}>这里的container 起到居中的作用，与tailwindcss.config配置文件中的center:true或者mx:auto 配合居中</p>
            <div className="container">
                <div className={"mx-auto"}>center</div>
            </div>
        </>
    )
}