import {Column, Entity, ObjectId, ObjectIdColumn} from "typeorm";


@Entity()
export class PathSegment {
    @ObjectIdColumn()
    _id?: ObjectId;

    @ObjectIdColumn()
    path!: ObjectId;

    @ObjectIdColumn()
    place!: ObjectId;

    @Column()
    type!: 'fixed' | 'embedding' | 'category' | 'event' | 'route';
}