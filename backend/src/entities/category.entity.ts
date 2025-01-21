import { Column, Entity, Index, ManyToMany, ObjectIdColumn } from "typeorm";
import { Place } from "./place.entity";


@Entity()
@Index(["name", "svg"], { unique: true })
export class Category {
    @ObjectIdColumn()
    _id?: string;

    @Column({ length: 80 })
    name!: string

    @Column()
    svg!: string

    @ManyToMany(
        () => Place,
    )
    places!: Place[];
}