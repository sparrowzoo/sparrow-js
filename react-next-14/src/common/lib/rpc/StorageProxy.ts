import {allowOrigin} from '../Env';
import {CommandType, StorageType, type StorageRequest, type StorageResponse} from '../protocol/CrosProtocol';
import StorageManager from '../storage/StorageManager';
import {Utils} from '../Utils';

export interface StorageProxyEvent {
    type: 'ready' | 'request' | 'response' | 'rejected' | 'stopped';
    command?: CommandType;
    storage?: StorageType;
    result?: 'value' | 'empty' | 'error';
    valueLength?: number;
    error?: 'INVALID_REQUEST' | 'STORAGE_FAILED' | 'POST_MESSAGE_FAILED';
}

function validRequest(request: Partial<StorageRequest>): request is StorageRequest {
    if (typeof request.key !== 'string' ||
        ![CommandType.GET, CommandType.SET, CommandType.REMOVE].includes(request.command as CommandType) ||
        !Object.values(StorageType).includes(request.storage as StorageType)) return false;
    if ((request.value !== undefined && typeof request.value !== 'string') ||
        (request.command === CommandType.SET && typeof request.value !== 'string')) return false;
    if (request.saveOptions !== undefined) {
        const options = request.saveOptions;
        if (!options || typeof options !== 'object' || Array.isArray(options) ||
            (options.remember !== undefined && typeof options.remember !== 'boolean')) return false;
    }
    return true;
}

/** Common authority-side handler for the normal and debug iframe pages. */
export default function startStorageProxy(onEvent?: (event: StorageProxyEvent) => void): () => void {
    const emit = (event: StorageProxyEvent) => {
        // Diagnostics have a closed shape with no key, request value or exception.
        try { onEvent?.(event); } catch { /* Monitoring must not affect storage. */ }
    };
    const stop = () => undefined;
    if (window.parent === window) return stop;
    const parentWindow = window.parent;
    let parentOrigin: string;
    try {
        const parentUrl = new URL(decodeURIComponent(window.location.search.slice(1)));
        if (!['http:', 'https:'].includes(parentUrl.protocol)) return stop;
        parentOrigin = parentUrl.origin;
    } catch {
        emit({type: 'rejected'});
        return stop;
    }
    if (!allowOrigin(parentOrigin)) {
        emit({type: 'rejected'});
        return stop;
    }
    const manager = new StorageManager();
    const reply = (response: StorageResponse | StorageRequest) => {
        try { parentWindow.postMessage(response, parentOrigin); }
        catch { emit({type: 'response', result: 'error', error: 'POST_MESSAGE_FAILED'}); }
    };
    const handleMessage = (event: MessageEvent<unknown>) => {
        if (event.origin !== parentOrigin || !allowOrigin(event.origin) || event.source !== parentWindow) {
            emit({type: 'rejected'});
            return;
        }
        if (!event.data || typeof event.data !== 'object' || Array.isArray(event.data)) return;
        const request = event.data as Partial<StorageRequest>;
        // Without a correlation ID there is no valid response to send.
        if (typeof request.requestId !== 'string') return;
        if (!validRequest(request)) {
            reply({requestId: request.requestId, value: null, error: 'INVALID_REQUEST'});
            emit({type: 'rejected', result: 'error', error: 'INVALID_REQUEST'});
            return;
        }
        const metadata = {command: request.command, storage: request.storage};
        emit({type: 'request', ...metadata});
        const response: StorageResponse = {requestId: request.requestId, value: null};
        try {
            switch (request.command) {
                case CommandType.GET:
                    response.value = manager.get(request.key, request.storage);
                    break;
                case CommandType.SET:
                    response.value = manager.set(request.key, request.value!, request.storage, request.saveOptions);
                    break;
                case CommandType.REMOVE:
                    response.value = manager.remove(request.key, request.storage);
                    break;
            }
        } catch {
            // Browser errors may embed the attempted value; never relay them.
            response.error = 'STORAGE_FAILED';
        }
        reply(response);
        emit({
            type: 'response', ...metadata,
            result: response.error ? 'error' : response.value === null ? 'empty' : 'value',
            valueLength: response.value?.length ?? 0,
            ...(response.error ? {error: 'STORAGE_FAILED' as const} : {}),
        });
    };
    window.addEventListener('message', handleMessage);
    reply({storage: StorageType.AUTOMATIC, requestId: Utils.randomUUID(), key: 'cros-iframe-storage', command: CommandType.INIT});
    emit({type: 'ready'});
    return () => {
        window.removeEventListener('message', handleMessage);
        emit({type: 'stopped'});
    };
}
