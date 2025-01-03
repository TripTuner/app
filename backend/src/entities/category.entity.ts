import { Column, Entity, JoinTable, ManyToMany, ObjectIdColumn } from "typeorm"
import { Place } from "./place.entity"


@Entity()
export class Category {
    @ObjectIdColumn()
    _id?: number

    @Column({ length: 80 })
    name!: string

    @Column()
    svg!: string

    @ManyToMany(() => Place, place => place.categories)
    @JoinTable()
    places!: Promise<Array<Place>>
}