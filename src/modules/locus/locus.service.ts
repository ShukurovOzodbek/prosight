import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { RncLocus } from './entities/rnc-locus.entity';
import { LocusQueryDto, SideloadOption, LocusSortField, SortOrder } from './dto/locus-query.dto';
import { LocusUser } from './interfaces/locus-user.interface';
import { ALLOWED_REGION_IDS_FOR_LIMITED_ROLE } from './constants';

@Injectable()
export class LocusService {
    constructor(
        @InjectRepository(RncLocus)
        private readonly locusRepository: Repository<RncLocus>,
    ) {}

    async getLocus(query: LocusQueryDto, user: LocusUser) {
        const role = user.role;

        const page = query.page ?? 1;
        const limit = query.limit ?? 1000;
        const sortBy = query.sortBy ?? LocusSortField.Id;
        const sortOrder = query.sortOrder ?? SortOrder.Asc;

        const isSideloadAllowed = role === 'admin';
        const requestedSideload = query.sideload === SideloadOption.LocusMembers;
        const shouldSideloadLocusMembers = isSideloadAllowed && requestedSideload;

        let effectiveRegionIds: number[] | undefined;
        let effectiveMembershipStatus: string | undefined;
        let needsLocusMembersJoin: boolean;

        if (role === 'normal') {
            effectiveRegionIds = undefined;
            effectiveMembershipStatus = undefined;
            needsLocusMembersJoin = false;
        } else if (role === 'limited') {
            effectiveRegionIds = [...ALLOWED_REGION_IDS_FOR_LIMITED_ROLE];
            effectiveMembershipStatus = undefined;
            needsLocusMembersJoin = true;
        } else {
            effectiveRegionIds = query.regionId;
            effectiveMembershipStatus = query.membershipStatus;
            needsLocusMembersJoin =
                (effectiveRegionIds?.length ?? 0) > 0 || !!effectiveMembershipStatus;
        }

        const shouldLoadLocusMembersRelation = shouldSideloadLocusMembers || needsLocusMembersJoin;

        const whereClause = this.buildWhereClause(
            query.ids,
            query.assemblyId,
            effectiveRegionIds,
            effectiveMembershipStatus,
            shouldLoadLocusMembersRelation,
        );

        const orderClause: FindOptionsOrder<RncLocus> = {
            [sortBy]: sortOrder,
        };

        const findOptions = {
            where: whereClause,
            relations: {
                locusMembers: shouldLoadLocusMembersRelation,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: orderClause,
        };

        const [list, total] = await Promise.all([
            this.locusRepository.find(findOptions),
            this.locusRepository.count({ where: whereClause }),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        return {
            data: list,
            total,
            currentPage: page,
            totalPages,
        };
    }

    private buildWhereClause(
        ids: number[] | undefined,
        assemblyId: number | undefined,
        regionIds: number[] | undefined,
        membershipStatus: string | undefined,
        includeLocusMembersCondition: boolean,
    ): FindOptionsWhere<RncLocus> {
        const where: FindOptionsWhere<RncLocus> = {};

        if (ids?.length) {
            where.id = In(ids);
        }
        if (assemblyId != null) {
            where.assemblyId = assemblyId as unknown as string;
        }

        if (includeLocusMembersCondition && (regionIds?.length || membershipStatus)) {
            where.locusMembers = {};
            if (regionIds?.length) {
                where.locusMembers.regionId = In(regionIds);
            }
            if (membershipStatus) {
                where.locusMembers.membershipStatus = membershipStatus;
            }
        }

        return where;
    }
}
