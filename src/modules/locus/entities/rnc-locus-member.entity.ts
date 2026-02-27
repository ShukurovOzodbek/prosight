import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RncLocus } from './rnc-locus.entity';

@Entity('rnc_locus_members')
export class RncLocusMember {
    @PrimaryColumn({ name: 'id' })
    locusMemberId: number;

    @Column()
    regionId: number;

    @Column()
    locusId: number;

    @Column()
    membershipStatus: string;

    @ManyToOne(() => RncLocus, (locus) => locus.locusMembers, { onDelete: 'CASCADE' })
    locus: RncLocus;
}
