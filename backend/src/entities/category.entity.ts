import { Column, Entity, ObjectIdColumn } from "typeorm"


@Entity()
export class Category {
    @ObjectIdColumn()
    _id?: number

    @Column({ length: 80 })
    name!: string

    @Column()
    svg!: string

    //@ManyToMany(() => Place, place => place.categories, { nullable: true })
    //@JoinTable()
    //places?: Array<Place>
}