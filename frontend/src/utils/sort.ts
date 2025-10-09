// utils/sort.ts
export function sortByNumKey<K extends PropertyKey>(
    key: K,
    dir: 'asc' | 'desc' = 'asc',
    missing: number = Number.POSITIVE_INFINITY
) {
    return <T extends Partial<Record<K, number>>>(a: T, b: T) => {
        const va = (a[key] ?? missing) as number;
        const vb = (b[key] ?? missing) as number;
        return dir === 'asc' ? va - vb : vb - va;
    };
}
