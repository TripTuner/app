import {getManager, Repository} from "typeorm";
import {PathSegment} from '../entities/path-segment.entity';
import * as CategoryService from "../services/category.service";
import * as errors from "../utils/errors";


/**
 * Fetches all path segments from database
 *
 * @param {Record<string, any>} qryObj a database query object
 * @returns {Promise<Array<PathSegment>>} a promise with the fetched path segments
 */
export const findAll = async function (qryObj: Record<string, any> = {}): Promise<Array<PathSegment>> {
    const repository: Repository<PathSegment> = getManager().getRepository(PathSegment);

    let segments = [];

    try {
        segments = await repository.find(qryObj);
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }

    return segments;
};

/**
 * Fetches path segment from database
 *
 * @param {Record<string, any>} qryObj fetch query object
 * @returns {Promise<PathSegment>} found path segment, otherwise throws error
 */
export const findPath = async function (qryObj: Record<string, any>): Promise<PathSegment> {
    const repository: Repository<PathSegment> = getManager().getRepository(PathSegment);

    try {
        const found = await repository.findOne(qryObj);
        if (found !== null)
            return found;
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }

    throw ( new errors.NotFound("path segment") );
};

/**
 * Adding new path segment to database
 *
 * @param {PathSegment} segment path segment to add
 * @returns {Promise<PathSegment>} saved path segment if everything ok, otherwise throws error
 */
export const saveNewSegment = async function (segment: PathSegment): Promise<PathSegment> {
    const repository: Repository<PathSegment> = getManager().getRepository(PathSegment);

    try {
        return await repository.save(segment);
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }
};

/**
 * Clears path database repository
 */
export const clearPathsRepository = async function () {
    const repository: Repository<PathSegment> = getManager().getRepository(PathSegment);

    try {
        await CategoryService.clearPlacesFromCategories();
        await repository.clear();
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }
};