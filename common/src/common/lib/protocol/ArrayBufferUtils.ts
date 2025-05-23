export default class ArrayBufferUtils {
  static bytes2ArrayBuffer(bytes: number[]): Uint8Array {
    const array = new Uint8Array(bytes.length);
    for (let i = 0; i < array.length; i++) {
      array[i] = bytes[i];
    }
    return array;
  }

  static str2Buffer(str: string): Uint8Array {
    if (typeof TextEncoder === "undefined") {
      const bytes: number[] = [];
      let c;
      for (let i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10ffff) {
          bytes.push(((c >> 18) & 0x07) | 0xf0);
          bytes.push(((c >> 12) & 0x3f) | 0x80);
          bytes.push(((c >> 6) & 0x3f) | 0x80);
          bytes.push((c & 0x3f) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00ffff) {
          bytes.push(((c >> 12) & 0x0f) | 0xe0);
          bytes.push(((c >> 6) & 0x3f) | 0x80);
          bytes.push((c & 0x3f) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007ff) {
          bytes.push(((c >> 6) & 0x1f) | 0xc0);
          bytes.push((c & 0x3f) | 0x80);
        } else {
          bytes.push(c & 0xff);
        }
      }
      return ArrayBufferUtils.bytes2ArrayBuffer(bytes);
    }
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  static number2Buffer(num: number): Uint8Array {
    length = 4;
    //只支持32位以下数字，32位以上会有精度问题
    const bytes: number[] = [];
    let i = length;
    do {
      //console.log(number.toString(2));
      bytes[--i] = num & 255;
      num = num >> 8;
    } while (i);
    return ArrayBufferUtils.bytes2ArrayBuffer(bytes);
  }

  public static appendBytes(
    bytes: Uint8Array,
    appendBytes: Uint8Array,
    offset: number
  ): number {
    bytes.set(appendBytes, offset);
    return offset + appendBytes.byteLength;
  }

  public readString(
    view: DataView,
    offset: number,
    length: number,
    isUTF16 = false
  ): string {
    let str = "";
    const step = isUTF16 ? 2 : 1;
    for (let i = 0; i < length; i += step) {
      const code = isUTF16
        ? view.getUint16(offset + i, true) // 小端序读取
        : view.getUint8(offset + i);
      str += String.fromCharCode(code);
    }
    return str;
  }
}
