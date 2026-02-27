import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocusService } from './locus.service';
import { LocusQueryDto } from './dto/locus-query.dto';

@Controller('locus')
export class LocusController {
    constructor(private readonly locusService: LocusService) {}

    @Get()
    @ApiOperation({ summary: 'Get locus with optional filters, pagination and sorting' })
    @ApiResponse({ status: 200, description: 'Locus data' })
    async getLocus(@Query() query: LocusQueryDto) {
        return this.locusService.getLocus(query);
    }
}
