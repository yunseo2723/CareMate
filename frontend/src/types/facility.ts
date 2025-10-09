export type CareLevel = '요양원' | '요양병원' | '주야간보호' | '기타'
export type Insurance = '건보' | '장기요양' | '비급여'


export interface Facility {
    id: string
    name: string
    address: string
    city: string
    lat: number
    lng: number
    monthlyCost: number
    rating: number
    bedsAvailable: number
    careLevel: CareLevel
    amenities: string[]
    insurance: Insurance[]
    photos?: string[]
    distanceKm?: number
}