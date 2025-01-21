export interface PlaceDataParserInterface {
    name: string;
    id: number;
    autoParse: boolean;
    category: string;
    type: number;
    geometry: "Point" | "MultiPoint" | "Polygon";
    base: string[];
    fields: {
        name: string
        email: string | string[]
        website: string
        phone: string | string[]
        schedule: string
        isPaid: string
        price: string
        address: string | string[]
    };
    data: {
        hasFoodPoint: string
        hasChangeRoom: string
        hasToilet: string
        hasWIFI: string
        hasWater: string
        hasChild: string
        hasSport: string
        info: string
        priceInfo: string
        conditions: string
        time: string
        subway: string
    };
}