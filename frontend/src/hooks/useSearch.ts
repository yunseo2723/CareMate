import { useContext } from 'react';
import { Ctx } from '../contexts/Ctx';

export function useSearch() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useSearch must be used within <SearchProvider>');
    return ctx;
}