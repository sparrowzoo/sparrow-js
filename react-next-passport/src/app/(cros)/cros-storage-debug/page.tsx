'use client'

import { useEffect, useRef, useState } from 'react'
import { CommandType, StorageRequest, StorageResponse, StorageType, } from '@/common/lib/protocol/CrosProtocol'
import { allowOrigin, TOKEN_STORAGE } from '@/common/lib/Env'
import { Utils } from '@/common/lib/Utils'

const MAX_EVENTS = 300

function serializeEvent(event: string, data?: unknown) {
    const timestamp = new Date().toISOString()
    const seen = new WeakSet<object>()
    try {
        return JSON.stringify({ timestamp, event, data }, (_key, value) => {
            if (typeof value === 'bigint') return `${value}n`
            if (value instanceof Error) {
                return { name: value.name, message: value.message, stack: value.stack }
            }
            if (value !== null && typeof value === 'object') {
                if (seen.has(value)) return '[Circular]'
                seen.add(value)
            }
            return value === undefined ? null : value
        }, 2)
    } catch {
        // 调试输出失败不能中断原有请求处理。
        return JSON.stringify({
            timestamp,
            event,
            serializationError: 'Unable to serialize event',
        }, null, 2)
    }
}

/** The iframe is a static, unlocalized page; storage access runs in the browser. */
export default function Page() {
    const [events, setEvents] = useState<{ id: number; json: string }[]>([])
    const nextEventId = useRef(1)
    useEffect(() => {
        const record = (event: string, data?: unknown) => {
            const entry = { id: nextEventId.current++, json: serializeEvent(event, data) }
            setEvents(previous => [entry, ...previous].slice(0, MAX_EVENTS))
        }

        if (window.parent === window) {
            record('standalone-init', { origin: window.location.origin })
            return
        }

        let parentOrigin: string
        try {
            // New clients encode their origin; existing clients sent a raw parent URL.
            parentOrigin = new URL(
                decodeURIComponent(window.location.search.slice(1))
            ).origin
        } catch (e) {
            record('parent-origin-error', { search: window.location.search, error: e })
            return
        }
        if (!allowOrigin(parentOrigin)) {
            record('parent-origin-rejected', { parentOrigin })
            return
        }

        const handleMessage = (event: MessageEvent<unknown>) => {
            // MessageEvent 的字段不会被 JSON.stringify 自动展开，且 source 是 Window。
            record('message-received', {
                type: event.type,
                origin: event.origin,
                lastEventId: event.lastEventId,
                fromParent: event.source === window.parent,
                data: event.data,
            })
            if (event.origin !== parentOrigin || !allowOrigin(event.origin)) {
                record('message-origin-rejected', { origin: event.origin, parentOrigin })
                return
            }
            if (!event.data || typeof event.data !== 'object') {
                record('message-data-rejected', { data: event.data })
                return
            }

            const request = event.data as Partial<StorageRequest>
            if (
                typeof request.requestId !== 'string' ||
                typeof request.key !== 'string'
            ) {
                record('request-fields-rejected', { requestId: request.requestId, key: request.key })
                return
            }
            if (
                ![
                    CommandType.GET,
                    CommandType.SET,
                    CommandType.REMOVE,
                ].includes(request.command as CommandType)
            ) {
                record('request-command-rejected', { requestId: request.requestId, command: request.command })
                return
            }
            if (
                ![
                    StorageType.LOCAL,
                    StorageType.SESSION,
                    StorageType.AUTOMATIC,
                ].includes(request.storage as StorageType)
            ) {
                record('request-storage-rejected', { requestId: request.requestId, storage: request.storage })
                return
            }

            const response: StorageResponse = {
                requestId: request.requestId,
                value: null,
            }
            try {
                const local =
                    request.storage === StorageType.LOCAL ||
                    (request.storage === StorageType.AUTOMATIC &&
                        TOKEN_STORAGE !== 'SESSION')
                const storage = local
                    ? window.localStorage
                    : window.sessionStorage
                switch (request.command) {
                    case CommandType.GET:
                        response.value = storage.getItem(request.key)
                        break
                    case CommandType.SET:
                        if (typeof request.value !== 'string')
                            throw new Error('Value is required for set command')
                        storage.setItem(request.key, request.value)
                        response.value = request.value
                        break
                    case CommandType.REMOVE:
                        response.value = storage.getItem(request.key)
                        storage.removeItem(request.key)
                        break
                }
            } catch (error) {
                record('storage-error', { requestId: request.requestId, error })
                response.error =
                    error instanceof Error
                        ? error.message
                        : 'Storage unavailable'
            }
            record('storage-result', response)
            window.parent.postMessage(response, parentOrigin)
            record('response-sent', { targetOrigin: parentOrigin, response })
        }

        window.addEventListener('message', handleMessage)
        record('listener-added', { parentOrigin })
        const ready: StorageRequest = {
            storage: StorageType.AUTOMATIC,
            requestId: Utils.randomUUID(),
            key: 'cros-iframe-storage',
            command: CommandType.INIT,
        }
        window.parent.postMessage(ready, parentOrigin)
        record('init-sent', { targetOrigin: parentOrigin, request: ready })
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    return (
        <main style={{ fontFamily: 'monospace', fontSize: 12, padding: 12, minHeight: '100vh', boxSizing: 'border-box', colorScheme: 'light dark', background: 'Canvas', color: 'CanvasText' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 16, margin: 0 }}>CrosStorage iframe · {events.length} events</h1>
                <button type="button" onClick={() => setEvents([])} disabled={!events.length}>Clear</button>
                <span>Latest first · max {MAX_EVENTS}</span>
            </header>
            {events.map(entry => (
                <pre key={entry.id} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', borderTop: '1px solid #d4d4d4', paddingTop: 12 }}>
                    {entry.json}
                </pre>
            ))}
        </main>
    )
}
