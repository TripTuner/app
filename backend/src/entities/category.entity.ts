import {Column, Entity, Index, ObjectId, ObjectIdColumn} from "typeorm";


@Entity()
@Index(["name", "svg"], { unique: true })
export class Category {
    @ObjectIdColumn()
    _id?: ObjectId;

    @Column({ length: 80 })
    name!: string

    @Column()
    svg!: string

    @Column()
    places!: ObjectId[];
}