export class Utils {
    public static randomUUID() {
        const hex = '0123456789abcdef';
        let uuid = '';
        for (let i = 0; i < 36; i++) {
            if ([8, 13, 18, 23].includes(i)) uuid += '-';
            else uuid += hex[Math.floor(Math.random() * 16)];
        }
        return uuid;
    }
}