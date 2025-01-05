import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./place.entity";


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    _id?: number

    @Column({ length: 80 })
    name!: string

    @Column()
    svg!: string

    @ManyToMany(() => Place, place => place.categories, { nullable: true })
    places?: Place[] | null;
}