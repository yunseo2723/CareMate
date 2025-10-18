import {useState, useMemo, type ReactNode} from 'react';
import { Ctx, type SearchContextValue } from './Ctx';
import { MOCKS } from '../data/mocks';
import { sortByNumKey } from '../utils/sort';
import type { Facility } from '../types/facility';

export function SearchProvider({ children }: { children: ReactNode }) {
    const [q, setQ] = useState('')
    const [center, setCenter] = useState('서울 강남구')
    const [detailCenter, setDetailCenter] = useState('')
    const [radiusKm, setRadiusKm] = useState(10)
    const [budget, setBudget] = useState(2000000)
    const [careLevel, setCareLevel] = useState('all')
    const [minRating, setMinRating] = useState(0)
    const [onlyAvailable, setOnlyAvailable] = useState(true)
    const [ins, setIns] = useState<string[]>([])
    const [amenities, setAmenities] = useState<string[]>([])
    const [sort, setSort] = useState('추천순')
    const [compare, setCompare] = useState<Facility[]>([])
    const [loading, setLoading] = useState(false)

    const results = useMemo(() => {
        let list = [...MOCKS]
        if (q) list = list.filter(v => v.name.includes(q) || v.address.includes(q))
        if (careLevel !== 'all') list = list.filter(v => v.careLevel === careLevel)
        list = list.filter(v => v.monthlyCost <= budget)
        list = list.filter(v => v.rating >= minRating)
        if (onlyAvailable) list = list.filter(v => v.bedsAvailable > 0)
        if (ins.length) list = list.filter(v => {
            const arr = (v.insurance ?? []) as string[];
            return ins.every(i => arr.includes(i));
        });

        switch (sort) {
            case '가격낮은순':   list.sort(sortByNumKey('monthlyCost', 'asc')); break;
            case '거리순':       list.sort(sortByNumKey('distanceKm','asc', Number.POSITIVE_INFINITY));   break;
            case '평점높은순':   list.sort(sortByNumKey('rating','desc', -Infinity));      break;
            default:
                list.sort((a, b) => (b.rating * 2 - b.monthlyCost / 1e6) - (a.rating * 2 - a.monthlyCost / 1e6));
        }
        return list;
    }, [q, careLevel, budget, minRating, onlyAvailable, ins, amenities, sort]);

    const toggleCompare = (f: Facility) => {
        setCompare(prev => {
            const exist = prev.find(p => p.id === f.id)
            if (exist) return prev.filter(p => p.id !== f.id)
            return [...prev.slice(0,3), f]
        })
    }

    const clearAll = () => {
        setQ(''); setCareLevel('all'); setBudget(2000000); setMinRating(0);
        setOnlyAvailable(true); setIns([]); setAmenities([]); setSort('추천순');
    }

    const value: SearchContextValue = {
        q, setQ, center, setCenter, detailCenter, setDetailCenter, radiusKm, setRadiusKm, budget, setBudget,
        careLevel, setCareLevel, minRating, setMinRating, onlyAvailable, setOnlyAvailable,
        ins, setIns, amenities, setAmenities, sort, setSort,
        loading, setLoading, results, compare, setCompare,
        toggleCompare, clearAll
    }

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
