export interface MapClickEntityModel {
    geometry: MapClickEntityGeometryModel,
    id: string;
    properties: MapClickEntityPropertiesModel;
}

export interface MapClickEntityGeometryModel {
    type: string;
    coordinates: number[];
}

export interface MapClickEntityPropertiesModel {
    name: string | undefined;
}