import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsEnum, IsArray, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { parseIntArray } from 'src/utils/helpers';

export enum SideloadOption {
    LocusMembers = 'locusMembers',
}

export enum LocusSortField {
    Id = 'id',
    AssemblyId = 'assemblyId',
    LocusStart = 'locusStart',
    LocusStop = 'locusStop',
    MemberCount = 'memberCount',
}

export enum SortOrder {
    Asc = 'asc',
    Desc = 'desc',
}

export class LocusQueryDto {
    @ApiPropertyOptional({ description: 'Filter by locus id(s)', example: '1,2,3' })
    @IsOptional()
    @Transform(({ value }) => parseIntArray(value))
    @IsArray()
    @IsInt({ each: true, message: 'id must be an integer or comma-separated integers' })
    ids?: number[];

    @ApiPropertyOptional({ description: 'Filter by assembly id (rl table)', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'assemblyId must be an integer' })
    assemblyId?: number;

    @ApiPropertyOptional({ description: 'Filter by region id(s) (rlm table)', example: '1,2' })
    @IsOptional()
    @Transform(({ value }) => parseIntArray(value))
    @IsArray()
    @IsInt({ each: true, message: 'regionId must be an integer or comma-separated integers' })
    regionId?: number[];

    @ApiPropertyOptional({
        description: 'Filter by membership status (rlm table)',
        example: 'member',
    })
    @IsOptional()
    @IsString()
    membershipStatus?: string;

    @ApiPropertyOptional({
        enum: SideloadOption,
        description: 'Related resources to include',
    })
    @IsOptional()
    @IsEnum(SideloadOption)
    sideload?: SideloadOption;

    @ApiPropertyOptional({ description: 'Page (1-based)', default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Rows per page',
        default: 1000,
        minimum: 1,
        maximum: 10000,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(10000)
    limit?: number = 1000;

    @ApiPropertyOptional({ enum: LocusSortField, description: 'Sort field' })
    @IsOptional()
    @IsEnum(LocusSortField)
    sortBy?: LocusSortField = LocusSortField.Id;

    @ApiPropertyOptional({ enum: SortOrder, description: 'Sort order' })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.Asc;
}
