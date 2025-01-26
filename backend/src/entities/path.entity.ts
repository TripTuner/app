import {Column, Entity, ObjectId, ObjectIdColumn} from "typeorm";


@Entity()
export class Path {
    @ObjectIdColumn()
    _id?: ObjectId;

    @ObjectIdColumn({nullable: true})
    user?: ObjectId;

    @Column()
    segments!: ObjectId[];
}