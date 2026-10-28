/** Matches String.getBytes(StandardCharsets.UTF_8), including malformed UTF-16. */
export function encodeUtf8(value: string): Uint8Array<ArrayBuffer> {
    // Java replaces an unpaired surrogate with '?'; TextEncoder uses U+FFFD.
    const characters: string[] = [];
    for (let index = 0; index < value.length; index++) {
        const code = value.charCodeAt(index);
        if (code >= 0xD800 && code <= 0xDBFF) {
            const next = value.charCodeAt(index + 1);
            if (next >= 0xDC00 && next <= 0xDFFF) {
                characters.push(value[index], value[++index]);
            } else {
                characters.push("?");
            }
        } else {
            characters.push(code >= 0xDC00 && code <= 0xDFFF ? "?" : value[index]);
        }
    }
    return new Uint8Array(new TextEncoder().encode(characters.join("")));
}

/** Java preserves the BOM and replaces an encoded surrogate as one malformed sequence. */
export function decodeUtf8(bytes: Uint8Array): string {
    const decoder = new TextDecoder("utf-8", {ignoreBOM: true});
    const surrogateStart = (index: number) => bytes[index] === 0xED &&
        bytes[index + 1] >= 0xA0 && bytes[index + 1] <= 0xBF;
    if (!bytes.some((_, index) => surrogateStart(index))) return decoder.decode(bytes);

    const normalized: number[] = [];
    for (let index = 0; index < bytes.length; index++) {
        if (!surrogateStart(index)) {
            normalized.push(bytes[index]);
            continue;
        }
        normalized.push(0xEF, 0xBF, 0xBD);
        index++;
        if (bytes[index + 1] >= 0x80 && bytes[index + 1] <= 0xBF) index++;
    }
    return decoder.decode(Uint8Array.from(normalized));
}
