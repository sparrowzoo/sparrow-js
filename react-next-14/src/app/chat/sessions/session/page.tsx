// https://nextjs.org/docs/app/api-reference/functions/use-search-params
'use client'
import { useSearchParams } from 'next/navigation'
import {Suspense} from "react";

function Session(){
    const searchParams = useSearchParams()
    const sessionKey = searchParams?.get('sessionKey')
    // URL -> `/dashboard?search=my-project`
    // `search` -> 'my-project'
    return <>Search: {sessionKey}</>
}

//https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function SessionPage() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <Session />
        </Suspense>
    )
}