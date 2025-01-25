import { Column, Entity, ObjectIdColumn } from "typeorm";
import { PlaceDataInterface } from "../interfaces/place-data.interface";


@Entity()
export class Place {
    @ObjectIdColumn()
    _id?: string

    @Column({ length: 80 })
    name?: string

    @Column({ nullable: true })
    type!: number

    @Column({ length: 80 })
    longitude!: number;

    @Column({ length: 80 })
    latitude!: number;

    @Column({ nullable: true })
    email?: string | null;

    @Column({ nullable: true })
    website?: string | null;

    @Column({ nullable: true })
    phone?: string | null;

    @Column({ nullable: true })
    schedule?: any | null;

    @Column({ nullable: true })
    isPaid?: boolean | null;

    @Column({ nullable: true })
    price?: string | null;

    @Column({ nullable: true })
    address?: string | null;

    @Column({ nullable: true })
    data?: PlaceDataInterface | null;

    @Column()
    categories?: string[];
}