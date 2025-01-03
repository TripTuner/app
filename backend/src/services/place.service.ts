import { getManager, Repository } from "typeorm"
import { Place } from "../entities/place.entity"
import * as errors from "../utils/errors"


/**
 * Fetches all events from database
 *
 * @param {Record<string, any>} qryObj a database query object
 * @returns {Promise<Array<Place>>} a promise with the fetched events
 */
export const findAll = async function (qryObj: Record<string, any> = {}): Promise<Array<Place>> {
    const repository: Repository<Place> = getManager().getRepository(Place)

    let events = []

    try {
        events = await repository.find(qryObj)
    } catch (error) {
        throw ( new errors.InternalServerError() )
    }

    return events
}

/**
 * Fetches events from database
 *
 * @param {Record<string, any>} qryObj fetch query object
 * @returns {Promise<Place>} found event, otherwise throws error
 */
export const findPlace = async function (qryObj: Record<string, any>): Promise<Place> {
    const repository: Repository<Place> = getManager().getRepository(Place)

    try {
        const found = await repository.findOne(qryObj)
        if (found !== null)
            return found
    } catch (error) {
        throw ( new errors.InternalServerError() )
    }

    throw ( new errors.NotFound("event place") )
}

/**
 * Adding new event to database
 *
 * @param {Place} place event to add
 * @returns {Promise<Place>} saved event if everything ok, otherwise throws error
 */
export const saveNewEvent = async function (place: Place): Promise<Place> {
    const repository: Repository<Place> = getManager().getRepository(Place)

    try {
        return await repository.save(place)
    } catch (error) {
        throw ( new errors.InternalServerError() )
    }
}

/**
 * Clears event database repository
 */
export const clearEventRepository = async function () {
    const repository: Repository<Place> = getManager().getRepository(Place)

    try {
        await repository.clear()
    } catch (error) {
        throw ( new errors.InternalServerError() )
    }
}