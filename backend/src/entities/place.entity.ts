import { Column, Entity, ObjectIdColumn } from "typeorm"
import { PlaceDataInterface } from "../interfaces/place-data.interface"


@Entity()
export class Place {
    @ObjectIdColumn()
    _id?: string

    @Column({ length: 80 })
    name!: string

    @Column()
    type!: number

    @Column()
    email?: string

    @Column()
    website?: string

    @Column()
    phone?: string

    @Column()
    schedule?: string

    @Column()
    isPaid?: boolean

    @Column()
    price?: string

    @Column()
    address?: string

    @Column()
    data?: PlaceDataInterface

    //@ManyToMany(() => Category, category => category.places, { nullable: true })
    //categories?: Array<Category>
}