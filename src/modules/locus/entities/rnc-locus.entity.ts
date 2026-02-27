import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { RncLocusMember } from './rnc-locus-member.entity';

@Entity('rnc_locus')
export class RncLocus {
    @PrimaryColumn()
    id: number;

    @Column()
    assemblyId: string;

    @Column()
    locusName: string;

    @Column()
    publicLocusName: string;

    @Column()
    chromosome: string;

    @Column()
    strand: string;

    @Column()
    locusStart: number;

    @Column()
    locusStop: number;

    @Column()
    memberCount: number;

    @OneToMany(() => RncLocusMember, (member) => member.locus)
    locusMembers: RncLocusMember[];
}
