import { Column, Entity, Index, ObjectIdColumn } from "typeorm";


@Entity()
@Index(["name", "svg"], { unique: true })
export class Category {
    @ObjectIdColumn()
    _id?: string;

    @Column({ length: 80 })
    name!: string

    @Column()
    svg!: string

    @Column()
    places!: string[];
}