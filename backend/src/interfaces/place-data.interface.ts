export interface PlaceDataInterface {
    hasFoodPoint?: boolean
    hasChangeRoom?: boolean
    hasToilet?: boolean
    hasWIFI?: boolean
    hasWater?: boolean
    hasChild?: boolean
    hasSport?: boolean
    info?: string
    priceInfo?: string
    conditions?: string
    time?: Array<any> | string;
    subway?: string
}