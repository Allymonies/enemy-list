import {Entity, Column, PrimaryColumn, Index, BaseEntity} from "typeorm";

@Entity()
export class Enemy extends BaseEntity {

    @Index({ unique: true })
    @PrimaryColumn("bigint", { name: "id", unique: true })
    id: string;

    @Column("int", { name: "order", unsigned: true })
    order: number;

    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @Column("text", { name: "description" })
    description: string;

}
