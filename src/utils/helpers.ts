export function parseIntArray(value: unknown): number[] | undefined {
    if (value == null || value === '') return undefined;

    const str = String(value).trim();
    if (!str) return undefined;

    const parts = str.split(',').map((s) => parseInt(s.trim(), 10));
    return parts;
}
