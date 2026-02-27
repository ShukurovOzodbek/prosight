/**
 * Parses comma-separated string to number[]. Returns undefined when empty.
 * Returns array (possibly with NaN) when input is present so that @IsInt({ each: true }) can fail with a clear error for non-integers.
 */
export function parseIntArray(value: unknown): number[] | undefined {
    if (value == null || value === '') return undefined;

    const str = String(value).trim();
    if (!str) return undefined;

    const parts = str.split(',').map((s) => parseInt(s.trim(), 10));
    return parts;
}