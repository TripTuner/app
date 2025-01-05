import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlaceDataInterface } from "../interfaces/place-data.interface";
import { Category } from "./category.entity";


@Entity()
export class Place {
    @PrimaryGeneratedColumn()
    _id?: string

    @Column({ length: 80 })
    name!: string

    @Column({ nullable: true })
    type!: number

    @Column({ nullable: true })
    email?: string | null;

    @Column({ nullable: true })
    website?: string | null;

    @Column({ nullable: true })
    phone?: string | null;

    @Column({ nullable: true })
    schedule?: string | null;

    @Column({ nullable: true })
    isPaid?: boolean | null;

    @Column({ nullable: true })
    price?: string | null;

    @Column({ nullable: true })
    address?: string | null;

    @Column({ nullable: true })
    data?: PlaceDataInterface | null;

    @ManyToMany(() => Category, category => category.places, { nullable: true })
    categories?: Category[] | null;
}