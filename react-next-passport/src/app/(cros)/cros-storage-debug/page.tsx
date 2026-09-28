'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {StorageType} from '@/common/lib/protocol/CrosProtocol'
import {TOKEN_STORAGE, WWW_ROOT} from '@/common/lib/Env'
import StorageManager from '@/common/lib/storage/StorageManager'
import startStorageProxy, {type StorageProxyEvent} from '@/common/lib/rpc/StorageProxy'

const MAX_EVENTS = 300
const MANUAL_KEY = 'hello'
type DebugEvent = StorageProxyEvent | {
    type: 'manual-read' | 'manual-write' | 'manual-error'
    storage: StorageType
    result: 'value' | 'empty' | 'error'
    valueLength?: number
    error?: 'STORAGE_FAILED'
}

/** Uses the same authority handler as the ordinary page; diagnostic values stay private. */
export default function Page() {
    const [manager] = useState(() => new StorageManager())
    const [events, setEvents] = useState<{id: number; json: string}[]>([])
    const [manualStorage, setManualStorage] = useState<StorageType>(
        TOKEN_STORAGE === 'COOKIE' ? StorageType.COOKIE : TOKEN_STORAGE === 'SESSION' ? StorageType.SESSION : StorageType.LOCAL
    )
    const [manualValue, setManualValue] = useState('')
    const nextEventId = useRef(1)
    const record = useCallback((event: DebugEvent) => {
        const entry = {id: nextEventId.current++, json: JSON.stringify({timestamp: new Date().toISOString(), ...event}, null, 2)}
        setEvents(previous => [entry, ...previous].slice(0, MAX_EVENTS))
    }, [])

    const readManually = () => {
        try {
            const value = manager.get(MANUAL_KEY, manualStorage)
            record({type: 'manual-read', storage: manualStorage, result: value === null ? 'empty' : 'value', valueLength: value?.length ?? 0})
        } catch {
            record({type: 'manual-error', storage: manualStorage, result: 'error', error: 'STORAGE_FAILED'})
        }
    }

    const writeManually = () => {
        try {
            const value = manager.set(MANUAL_KEY, manualValue, manualStorage)
            record({type: 'manual-write', storage: manualStorage, result: 'value', valueLength: value.length})
        } catch {
            record({type: 'manual-error', storage: manualStorage, result: 'error', error: 'STORAGE_FAILED'})
        }
    }

    useEffect(() => startStorageProxy(record), [record])

    return (
        <main style={{fontFamily: 'monospace', fontSize: 12, padding: 12, minHeight: '100vh', boxSizing: 'border-box', colorScheme: 'light dark', background: 'Canvas', color: 'CanvasText'}}>
            <header style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'}}>
                <h1 style={{fontSize: 16, margin: 0}}>CrosStorage iframe · {events.length} events</h1>
                <button type="button" onClick={() => setEvents([])} disabled={!events.length}>Clear</button>
                <span>Latest first · max {MAX_EVENTS}</span>
                {WWW_ROOT && <a href={`${WWW_ROOT.replace(/\/+$/, '')}/zh/cros/`} target="_top">Token 读取监控页 →</a>}
            </header>
            <form onSubmit={event => {event.preventDefault(); readManually()}}
                  style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12}}>
                <span>Key: <code>{MANUAL_KEY}</code></span>
                <label htmlFor="manual-storage">Storage: </label>
                <select id="manual-storage" value={manualStorage} onChange={event => setManualStorage(event.target.value as StorageType)}>
                    <option value={StorageType.LOCAL}>localStorage</option>
                    <option value={StorageType.SESSION}>sessionStorage</option>
                    <option value={StorageType.COOKIE}>Cookie</option>
                </select>
                <button type="submit">Read hello</button>
                <label htmlFor="manual-value">Value: </label>
                <input id="manual-value" type="text" value={manualValue} onChange={event => setManualValue(event.target.value)}
                       autoComplete="off" spellCheck={false}
                       style={{width: 280, maxWidth: '100%', minWidth: 0, boxSizing: 'border-box'}} />
                <button type="button" onClick={writeManually}>Write hello</button>
            </form>
            {events.map(entry => (
                <pre key={entry.id} style={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', borderTop: '1px solid #d4d4d4', paddingTop: 12}}>
                    {entry.json}
                </pre>
            ))}
        </main>
    )
}
