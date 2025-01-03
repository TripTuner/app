import { getManager, Repository } from "typeorm"
import { EventPlace } from "../entities/event-place.entity"
import * as errors from "../utils/errors"


/**
 * Fetches all events from database
 *
 * @param {Record<string, any>} qryObj a database query object
 * @returns {Promise<Array<EventPlace>>} a promise with the fetched events
 */
export const findAll = async function (qryObj: Record<string, any> = {}): Promise<Array<EventPlace>> {
    const repository: Repository<EventPlace> = getManager().getRepository(EventPlace);

    let events = [];

    try {
        events = await repository.find(qryObj);
    } catch (error) {
        throw (new errors.InternalServerError());
    }

    return events;
}

/**
 * Fetches events from database
 *
 * @param {Record<string, any>} qryObj fetch query object
 * @returns {Promise<EventPlace>} found event, otherwise throws error
 */
export const findEvent = async function (qryObj: Record<string, any>): Promise<EventPlace> {
    const repository: Repository<EventPlace> = getManager().getRepository(EventPlace);

    try {
        const found = await repository.findOne(qryObj);
        if (found !== null)
            return found;
    } catch (error) {
        throw (new errors.InternalServerError());
    }

    throw (new errors.NotFound('event place'))
}

/**
 * Adding new event to database
 *
 * @param {EventPlace} event event to add
 * @returns {Promise<EventPlace>} saved event if everything ok, otherwise throws error
 */
export const saveNewEvent = async function (event: EventPlace): Promise<EventPlace> {
    const repository: Repository<EventPlace> = getManager().getRepository(EventPlace);

    try {
        return await repository.save(event);
    } catch (error) {
        throw (new errors.InternalServerError());
    }
}

/**
 * Clears event database repository
 */
export const clearEventRepository = async function () {
    const repository: Repository<EventPlace> = getManager().getRepository(EventPlace);

    try {
        await repository.clear();
    } catch (error) {
        throw (new errors.InternalServerError());
    }
}