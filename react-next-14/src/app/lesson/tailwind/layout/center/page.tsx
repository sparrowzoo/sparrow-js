// @ts-ignore
import html from './center.html'

export default function Page() {
    return (<>
            <div dangerouslySetInnerHTML={{__html:html}}></div>
            <div className={"w-24 border border-red-700  mx-auto"}>center</div>
        </>
    )
}