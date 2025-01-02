import { Controller } from "@tsoa/runtime";
import { Body, Get, OperationId, Path, Route, Tags } from "tsoa";
import { EventPlace } from "../entities/event-place.entity";
import * as EventPlaceService from '../services/event-place.service';

@Route('event-places')
export class EventPlaces extends Controller {
    @Get('all')
    @Tags("BackendApi")
    @OperationId('getAll')
    public async getAll(): Promise<Array<EventPlace>> {
        return await EventPlaceService.findAll();
    }
    
    @Get(`id/{event_id}`)
    @Tags("BackendApi")
    @OperationId('getById')
    public async getById(
        @Path() event_id: number
    ): Promise<EventPlace> {
        return await EventPlaceService.findEvent({ where: { _id: event_id } });
    }
}