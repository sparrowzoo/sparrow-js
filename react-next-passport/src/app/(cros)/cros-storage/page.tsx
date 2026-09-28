'use client'

import {useEffect} from 'react'
import startStorageProxy from '@/common/lib/rpc/StorageProxy'

/** The iframe is a static, unlocalized page; storage access runs in the browser. */
export default function Page() {
    useEffect(() => startStorageProxy(), [])
    return null
}
