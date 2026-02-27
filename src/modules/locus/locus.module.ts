import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';
import { RncLocus } from './entities/rnc-locus.entity';
import { RncLocusMember } from './entities/rnc-locus-member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RncLocus, RncLocusMember]), AuthModule],
    controllers: [LocusController],
    providers: [LocusService],
})
export class LocusModule {}
