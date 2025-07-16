'use client'
export default async function DynamicComponent(path) {
    try {
        const module = await import(path);
        return module.default;
    } catch {
        return null;
    }
}
