import http from 'node:http';
import {WebSocketServer} from 'ws';

// An isolated test peer, not the Java API/gateway. The codec deliberately does
// not import the production encoder so incorrect bytes cannot validate themselves.
export const DIRECT_KEY = '0z1Azzzzzzzzzz1';
export const GROUP_KEY = '1e2e-group';
export const users = [
    {id: '1', category: 1, name: 'E2E Alice'},
    {id: 'zzzzzzzzzz', category: 61, name: 'E2E Bob'},
];

export function tokenFor(user) {
    const body = JSON.stringify({userId: user.id, category: user.category,
        userName: user.name, nickName: user.name, avatar: '/avatar/visitor.jpg', deviceType: 1});
    return `e2e.${Buffer.from(JSON.stringify({body})).toString('base64').replace(/=+$/, '')}.synthetic`;
}

function contact(user) {
    return {userId: user.id, userName: user.name, nickName: user.name,
        category: user.category, nationality: 'Test', avatar: '/avatar/visitor.jpg'};
}

function decodeFrame(bytes) {
    let offset = 0;
    const byte = () => bytes.readUInt8(offset++);
    const text = length => { const value = bytes.toString('utf8', offset, offset + length); offset += length; return value; };
    const user = () => ({id: text(byte()), category: byte()});
    const protocolType = bytes.readInt8(offset++);
    if ([30, 45].includes(protocolType)) {
        if (bytes.length !== 1) throw new Error('Invalid heartbeat/status query length');
        return {protocolType};
    }
    const device = byte();
    const chatType = byte();
    const messageType = bytes.readUInt16BE(offset); offset += 2;
    const length = bytes.readInt32BE(offset); offset += 4;
    if (length < 0 || length > bytes.length - offset) throw new Error('Invalid payload length');
    const content = text(length);
    const times = text(byte()).split('_').map(Number);
    const sender = user();
    const receiver = chatType === 0 ? user() : null;
    const sessionKey = chatType === 0 ? DIRECT_KEY : text(byte());
    if (offset !== bytes.length) throw new Error('Trailing/truncated frame');
    return {protocolType, device, chatType, messageType, content, clientSendTime: times[0],
        serverTime: times[1], sender, receiver, sessionKey};
}

function encodeMessage(message) {
    const content = Buffer.from(message.content);
    const header = Buffer.alloc(9);
    header.writeInt8(8, 0);
    header.writeUInt8(1, 1);
    header.writeUInt8(message.chatType, 2);
    header.writeUInt16BE(0, 3);
    header.writeInt32BE(content.length, 5);
    const times = Buffer.from(`${message.clientSendTime}_${message.serverTime}`);
    const user = value => { const id = Buffer.from(value.id); return Buffer.concat([Buffer.from([id.length]), id, Buffer.from([value.category])]); };
    const target = message.chatType === 0 ? user(message.receiver) :
        Buffer.concat([Buffer.from([Buffer.byteLength(message.sessionKey)]), Buffer.from(message.sessionKey)]);
    return Buffer.concat([header, content, Buffer.from([times.length]), times, user(message.sender), target]);
}

export async function startFixture() {
    const frames = [];
    const requests = [];
    const errors = [];
    const sockets = new Map();
    const state = {directSessionKey: DIRECT_KEY};
    const group = {qunId: 'e2e-group', qunName: 'E2E Test Group', ownerId: '1', avatar: '/avatar/visitor.jpg'};
    const userMap = Object.fromEntries(users.map(user => [user.id, contact(user)]));
    const history = new Map([
        [DIRECT_KEY, [{messageId: '100', sessionKey: DIRECT_KEY, sender: {id: users[1].id, category: 61},
            receiver: {id: '1', category: 1}, content: 'E2E saved direct history', clientSendTime: Date.now() - 60_000, serverTime: Date.now() - 59_000}]],
        [GROUP_KEY, [{messageId: '101', sessionKey: GROUP_KEY, sender: {id: '1', category: 1},
            content: 'E2E saved group history', clientSendTime: Date.now() - 60_000, serverTime: Date.now() - 59_000}]],
    ]);
    const identify = token => users.find(user => tokenFor(user) === token);
    const server = http.createServer(async (request, response) => {
        response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3303');
        response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        if (request.method === 'OPTIONS') { response.writeHead(204).end(); return; }
        const url = new URL(request.url, 'http://127.0.0.1:18888');
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString();
        let body = raw;
        try { body = JSON.parse(raw); } catch { /* messages endpoint accepts a bare key */ }
        requests.push({method: request.method, path: url.pathname, body});
        response.setHeader('Content-Type', 'application/json');
        const user = identify(request.headers.authorization);
        if (!user) { response.writeHead(401).end(JSON.stringify({code: 'unauthorized'})); return; }
        let data;
        if (url.pathname === '/chat/v2/sessions.json') {
            data = [DIRECT_KEY, GROUP_KEY].map(historyKey => {
                const key = historyKey === DIRECT_KEY ? state.directSessionKey : historyKey;
                return {chatType: historyKey === DIRECT_KEY ? 0 : 1, id: key.slice(1), sessionKey: key,
                    sessionUrl: `/chat/sessions/session?sessionKey=${key}`, unreadCount: 2,
                    lastReadTime: Date.now(), lastMessage: history.get(historyKey).at(-1)};
            });
        } else if (url.pathname === '/contact/contacts.json') {
            data = {userMap, contactIds: users.map(user => user.id), quns: [group]};
        } else if (url.pathname === '/contact/get-users-by-ids.json') {
            data = body.map(id => userMap[id]).filter(Boolean);
        } else if (url.pathname === '/chat/v2/messages.json') {
            data = history.get(body) ?? [];
        } else if (url.pathname === '/qun/detail/e2e-group.json') {
            data = {detail: group, members: [], userDicts: userMap};
        } else if (url.pathname === '/chat/v2/query-history-messages.json') {
            const selected = history.get(body.sessionKey) ?? [];
            data = {historyMessages: body.lastMessageId > 0 ? [] : selected.filter(message => message.content.includes(body.content || '')),
                qunMaps: {[group.qunId]: {id: group.qunId, name: group.qunName, ownerId: group.ownerId, avatar: group.avatar}}, userMaps: userMap};
        } else if (url.pathname === '/chat/v2/session-list.json') {
            data = [];
        } else {
            errors.push(`Unexpected HTTP endpoint: ${url.pathname}`);
            response.writeHead(404).end(JSON.stringify({code: 'not-found'})); return;
        }
        response.end(JSON.stringify({code: '0', data}));
    });
    const wss = new WebSocketServer({server, path: '/websocket'});
    wss.on('connection', (socket, request) => {
        const user = identify(request.headers['sec-websocket-protocol']);
        if (!user) { socket.close(1008); return; }
        sockets.set(user.id, socket);
        socket.send(JSON.stringify({code: '0', instruction: 'AUTH_BIND'}));
        socket.on('close', () => { if (sockets.get(user.id) === socket) sockets.delete(user.id); });
        socket.on('message', (bytes, binary) => {
            try {
                if (!binary) throw new Error('Expected a binary protocol frame');
                const message = decodeFrame(bytes);
                frames.push(message);
                if (message.protocolType === 30) { socket.send(Buffer.from([40])); return; }
                if (message.protocolType === 45) return;
                if (message.protocolType !== 8 || message.sender.id !== user.id || message.sender.category !== user.category) {
                    throw new Error('Unexpected message protocol or sender');
                }
                message.serverTime = Date.now();
                message.messageId = String(1000 + frames.length);
                history.get(message.sessionKey).push(message);
                const targets = message.chatType === 0 ? [message.receiver.id] : users.filter(peer => peer.id !== user.id).map(peer => peer.id);
                for (const id of targets) sockets.get(id)?.send(encodeMessage(message));
            } catch (error) { errors.push(error.message); }
        });
    });
    await new Promise((resolve, reject) => {server.once('error', reject); server.listen(18888, '127.0.0.1', resolve);});
    return {frames, requests, errors, sockets, state,
        async close() {
            for (const socket of wss.clients) socket.terminate();
            await new Promise(resolve => wss.close(resolve));
            await new Promise(resolve => server.close(resolve));
        },
    };
}
