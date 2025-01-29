import { getManager, ObjectId, Repository } from "typeorm";
import { Category } from "../entities/category.entity";
import * as errors from "../utils/errors";


/**
 * Fetches all categories from database
 *
 * @param {Record<string, any>} qryObj a  database query object
 * @returns {Promise<Array<Category>>} a promise with the fetched categories
 */
export const findAll = async function (qryObj: Record<string, any> = {}): Promise<Array<Category>> {
	const repository: Repository<Category> = getManager().getRepository(Category);

	let categories = [];

	try {
		categories = await repository.find(qryObj);
	} catch (error) {
		throw ( new errors.InternalServerError() );
	}

	return categories;
};

/**
 * Fetches category from database
 *
 * @param {Record<string, any>} qryObj fetch query object
 * @returns {Promise<Category>} found category, otherwise throws error
 */
export const findCategory = async function (qryObj: Record<string, any>): Promise<Category> {
	const repository: Repository<Category> = getManager().getRepository(Category);

	try {
		const found = await repository.findOne(qryObj);
		if (found !== null)
			return found;
	} catch (error) {
		throw ( new errors.InternalServerError() );
	}

	throw ( new errors.NotFound("category") );
};

/**
 * Adding new category to database
 *
 * @param {Category} category category to add
 * @returns {Promise<Category>} saved category if everything ok, otherwise throws error
 */
export const saveNewCategory = async function (category: Category): Promise<Category> {
	const repository: Repository<Category> = getManager().getRepository(Category);

	try {
		return await repository.save(category);
	} catch (error) {
		console.log(error);
		throw ( new errors.InternalServerError() );
	}
};

/**
 * Clears category database repository
 *
 * @returns {Promise<void>} if everything ok, otherwise throws an error
 */
export const clearCategoryRepository = async function (): Promise<void> {
	const repository: Repository<Category> = getManager().getRepository(Category);

	try {
		await repository.clear();
	} catch (error) {
		throw ( new errors.InternalServerError() );
	}
};

/**
 * Function that removes all Places from every category with special qualities
 *
 * @param {Record<string, any>} qryObj query object of categories
 * @returns {Promise<void>} if everything ok, otherwise throws an error
 */
export const clearPlacesFromCategories = async function (qryObj: Record<string, any> = {}): Promise<void> {
	const repository: Repository<Category> = getManager().getRepository(Category);

	try {
		const categories = await findAll(qryObj);
		for (const category of categories) {
			category.places = [];
			await repository.save(category);
		}
	} catch (error) {
		throw ( new errors.InternalServerError() );
	}
};

export const getAllByIds = async function (ids: ObjectId[]): Promise<Array<Category>> {
	const repository: Repository<Category> = getManager().getRepository(Category);

	try {
		const categories = [];
		for (const id of ids)
			categories.push(await findCategory({ where: { id: id } }));
		return categories;
	} catch (error) {
		throw ( new errors.InternalServerError() );
	}
};