import { getManager, Repository } from "typeorm";
import { ServerSideSessionContext } from "../sessions/context";
import { User } from "../entities/user.entity";
import { UserPublic, UserRegister } from "../interfaces/user.interfaces";

import * as errors from "../utils/errors"


/**
 * Fetches a single user from the user collection
 *
 * @param  {Record<string, any>} qryObj a database query object
 * @param  {boolean} isPublic whether the returned user object should hide sensitive fields. true by default
 * @returns {Promise<User|UserPublic>} a promise with the fetched user
 */
export const findUser = async function (qryObj: Record<string, any>, isPublic: boolean = true): Promise<User | UserPublic> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    let user;
    
    try {
        user = await userRepository.findOne(qryObj);
    } catch (error) {
        throw (new errors.InternalServerError());
    }
    
    if (!user) throw (new errors.UserNotFound());
    
    return isPublic ? user.public() : user;
}

/**
 * Checks if the user already exists in the collection
 *
 * @param  {Record<string, any>} qryObj a database query object
 * @returns {Promise<void>} a void promise if user doesn't exist. throws error if user already exists
 */
export const checkIfUserAlreadyExists = async function (qryObj: Record<string, any>): Promise<void> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    
    try {
        if (!await userRepository.findOne(qryObj))
            return;
    } catch (error) {
        throw (new errors.InternalServerError());
    }
    
    throw (new errors.UserAlreadyExists());
}

/**
 * Checks that user password is same as `password`
 *
 * @param {User} user the user whose password is to be checked
 * @param {string} password the password to be checked
 * @returns {Promise<void>} a void promise if correct. Throws otherwise
 */
export const checkIfUserPasswordCorrect = async function (user: User, password: string): Promise<void> {
    if (!(await user.checkIfUnencryptedPasswordIsValid(password)))
        throw (new errors.InvalidUserPassword('WrongPassword'))
    
    return
}

/**
 * Returns a new User model for saving a new user
 *
 * @param  {UserPublic} user user public object
 * @returns {User} the created user model
 */
export const createNewUserModel = function (user: UserRegister): User {
    const result: User = new User();

    result.name = user.name || '';
    result.email = user.email || '';
    result.password = user.password;
    
    return result;
}

/**
 * Return a new ServerSideSessionContext for a new auth in redis
 *
 * @param {User} user user to be authed in redis
 * @returns {ServerSideSessionContext} context for saving in redis
 */
export const createNewServerSideUserContext = function (user: User): ServerSideSessionContext {
    const result = new ServerSideSessionContext();
    
    result.sessionId = user._id.toString();
    result.email = user.email;
    
    return result;
}

/**
 * Saves a new user in the User collection
 *
 * @param {User} user user to be saved
 * @returns {Promise<User>} a promise with the saved user
 */
export const saveNewUser = async function (user: User): Promise<User> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    
    try {
        await user.hashPassword();
        
        return await userRepository.save(user);
    } catch (error) {
        throw (new errors.InternalServerError());
    }
}