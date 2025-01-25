import _ from 'lodash'
import {Column, Entity, ObjectId, ObjectIdColumn} from "typeorm";
import { UserPublic } from "../interfaces/user.interfaces";
import { bcryptCompareAsync, bcryptHashAsync } from "../utils/crypto";


@Entity()
export class User {
    @ObjectIdColumn()
    _id!: ObjectId
    
    @Column({ length: 80 })
    name!: string
    
    @Column({ length: 100 })
    email!: string
    
    @Column('text')
    password?: string
    
    async hashPassword(): Promise<void> {
        if (this.password)
            this.password = await bcryptHashAsync(this.password, 8)
    }
    
    async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): Promise<boolean> {
        return bcryptCompareAsync(unencryptedPassword, this.password || '')
    }
    
    /**
     * Hides sensitive fields like **password, refreshToken**
     *
     * @returns {UserPublic} the user object but stripped of sensitive fields
     */
    public(): UserPublic {
        return _.omit({ id: this._id.toString(), ...this }, ['_id', 'password', 'refreshToken'])
    }
}