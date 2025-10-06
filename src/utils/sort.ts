export const sortByKey = <T extends Record<string, any>>(key: keyof T, dir: 'asc'|'desc'='asc') => (a:T, b:T) => {
    const va = (a?.[key] ?? 0) as number
    const vb = (b?.[key] ?? 0) as number
    return dir==='asc' ? (va - vb) : (vb - va)
}