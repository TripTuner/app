import {getManager, ObjectId, Repository} from "typeorm";
import {Path} from '../entities/path.entity';
import {PathSegment} from '../entities/path-segment.entity';
import * as CategoryService from "../services/category.service";
import * as errors from "../utils/errors";


/**
 * Fetches all paths from database
 *
 * @param {Record<string, any>} qryObj a database query object
 * @returns {Promise<Array<Path>>} a promise with the fetched paths
 */
export const findAll = async function (qryObj: Record<string, any> = {}): Promise<Array<Path>> {
    const repository: Repository<Path> = getManager().getRepository(Path);

    let paths = [];

    try {
        paths = await repository.find(qryObj);
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }

    return paths;
};

/**
 * Fetches paths from database
 *
 * @param {Record<string, any>} qryObj fetch query object
 * @returns {Promise<Path>} found path, otherwise throws error
 */
export const findPath = async function (qryObj: Record<string, any>): Promise<Path> {
    const repository: Repository<Path> = getManager().getRepository(Path);

    try {
        const found = await repository.findOne(qryObj);
        if (found !== null)
            return found;
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }

    throw ( new errors.NotFound("path") );
};

/**
 * Adding new path to database
 *
 * @param {Path} path path to add
 * @returns {Promise<Path>} saved path if everything ok, otherwise throws error
 */
export const saveNewPath = async function (path: Path): Promise<Path> {
    const repository: Repository<Path> = getManager().getRepository(Path);

    try {
        return await repository.save(path);
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }
};

/**
 * Adding segment to path by ids
 *
 * @param {Path} path path to add categories to
 * @param {string[]} segmentsIds ids of path segments
 * @retuns {Path} path with new segments
 */
export const addSegments = async (path: Path, segmentsIds: ObjectId[]): Promise<Path> => {
    const repository: Repository<Path> = getManager().getRepository(Path);
    const segmentsRepository: Repository<PathSegment> = getManager().getRepository(PathSegment);

    try {
        const segments = await segmentsRepository.findByIds(segmentsIds);
        if (path.segments === null)
            path.segments = [];
        for (const segment of segments) {
            segment.path = path._id!;
            await segmentsRepository.save(segment);
            path.segments?.push(segment._id!);
        }
        return await repository.save(path);
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }
}

/**
 * Get segments by path
 *
 * @param {Path} path path
 * @retuns {PathSegment[]} array of path segments
 */
export const getSegments = async (path: Path): Promise<PathSegment[]> => {
    const segmentsRepository: Repository<PathSegment> = getManager().getRepository(PathSegment);

    try {
        return await segmentsRepository.findByIds(path.segments);
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }
}

/**
 * Clears path database repository
 */
export const clearPathsRepository = async function () {
    const repository: Repository<Path> = getManager().getRepository(Path);

    try {
        await CategoryService.clearPlacesFromCategories();
        await repository.clear();
    } catch (error) {
        throw ( new errors.InternalServerError() );
    }
};