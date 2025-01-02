import { Column, Entity, ObjectIdColumn } from "typeorm";


@Entity()
export class EventPlace {
    @ObjectIdColumn()
    _id!: string
    
    @Column({ length: 80 })
    name!: string
    
    @Column()
    description!: string
    
    @Column()
    longitude!: number
    
    @Column()
    latitude!: number
    
    @Column()
    start_time!: string
    
    @Column()
    finish_time!: string
}