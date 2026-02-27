import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocusService } from './locus.service';
import { LocusQueryDto } from './dto/locus-query.dto';
import type { LocusUser } from './interfaces/locus-user.interface';

@Controller('locus')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
export class LocusController {
    constructor(private readonly locusService: LocusService) {}

    @Get()
    @ApiOperation({ summary: 'Get locus (requires JWT)' })
    @ApiResponse({ status: 200, description: 'Locus data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getLocus(@Query() query: LocusQueryDto, @Req() req: Request) {
        const user = req.user as LocusUser;
        return this.locusService.getLocus(query, user);
    }
}
