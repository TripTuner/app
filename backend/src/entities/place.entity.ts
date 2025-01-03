import { Column, Entity, ManyToMany, ObjectIdColumn } from "typeorm"
import { Category } from "./category.entity"


@Entity()
export class Place {
    @ObjectIdColumn()
    _id?: string

    @Column({ length: 80 })
    name!: string

    @Column()
    description!: string

    @Column()
    longitude!: number

    @Column()
    latitude!: number

    @ManyToMany(() => Category, category => category.places)
    categories!: Promise<Array<Category>>
}