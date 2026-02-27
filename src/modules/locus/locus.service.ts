import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { RncLocus } from './entities/rnc-locus.entity';
import { LocusQueryDto, SideloadOption, LocusSortField, SortOrder } from './dto/locus-query.dto';

@Injectable()
export class LocusService {
    constructor(
        @InjectRepository(RncLocus)
        private readonly locusRepository: Repository<RncLocus>,
    ) {}

    async getLocus(query: LocusQueryDto) {
        const {
            ids,
            assemblyId,
            regionId: regionIds,
            membershipStatus,
            sideload,
            page = 1,
            limit = 1000,
            sortBy = LocusSortField.Id,
            sortOrder = SortOrder.Asc,
        } = query;

        const shouldSideload = sideload === SideloadOption.LocusMembers;
        const needsMemberFilter = regionIds?.length || membershipStatus;

        const where: FindOptionsWhere<RncLocus> = {};

        if (ids?.length) {
            where.id = In(ids);
        }
        if (assemblyId != null) {
            where.assemblyId = assemblyId as unknown as string;
        }
        if (needsMemberFilter) {
            where.locusMembers = {};
            if (regionIds?.length) {
                where.locusMembers.regionId = In(regionIds);
            }
            if (membershipStatus) {
                where.locusMembers.membershipStatus = membershipStatus;
            }
        }

        const order: FindOptionsOrder<RncLocus> = {
            [sortBy]: sortOrder,
        };

        const [list, total] = await Promise.all([
            this.locusRepository.find({
                where,
                relations: {
                    locusMembers: shouldSideload || !!needsMemberFilter,
                },
                skip: (page - 1) * limit,
                take: limit,
                order,
            }),
            this.locusRepository.count({ where }),
        ]);

        const distinctList = needsMemberFilter
            ? Array.from(new Map(list.map((l) => [l.id, l])).values())
            : list;

        const totalPages = Math.ceil(total / limit) || 1;

        const data = shouldSideload
            ? distinctList.map((locus) => ({
                  id: locus.id,
                  assemblyId: locus.assemblyId,
                  locusName: locus.locusName,
                  publicLocusName: locus.publicLocusName,
                  chromosome: locus.chromosome,
                  strand: locus.strand,
                  locusStart: locus.locusStart,
                  locusStop: locus.locusStop,
                  memberCount: locus.memberCount,
                  locusMembers: locus.locusMembers?.map((m) => ({
                      locusMemberId: m.locusMemberId,
                      regionId: m.regionId,
                      locusId: m.locusId,
                      membershipStatus: m.membershipStatus,
                  })),
              }))
            : distinctList.map((locus) => ({
                  id: locus.id,
                  assemblyId: locus.assemblyId,
                  locusName: locus.locusName,
                  publicLocusName: locus.publicLocusName,
                  chromosome: locus.chromosome,
                  strand: locus.strand,
                  locusStart: locus.locusStart,
                  locusStop: locus.locusStop,
                  memberCount: locus.memberCount,
              }));

        return {
            data,
            total,
            currentPage: page,
            totalPages,
        };
    }
}
