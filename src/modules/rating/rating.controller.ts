import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { RatingDto } from './dto/rating.dto';
import { Roles } from 'src/common/decorators/role';

@ApiBearerAuth()
@Controller('rating')
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    @ApiOperation({ summary: 'Get all ratings - SUPERADMIN, ADMIN' })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Get('all')
    getAll() {
        return this.ratingService.getAllRating()
    }

    @ApiOperation({ summary: 'Get ratings by course id' })
    @UseGuards(AuthGuard)
    @Get('course/:courseId')
    getByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.ratingService.getByCourse(courseId)
    }

    @ApiOperation({ summary: 'Get my ratings' })
    @UseGuards(AuthGuard)
    @Get('my')
    getMyRatings(@Req() req: Request) {
        return this.ratingService.getMyRatings(req['user'])
    }

    @ApiOperation({ summary: 'Create rating' })
    @UseGuards(AuthGuard)
    @Post('create')
    createRating(
        @Body() payload: RatingDto,
        @Req() req: Request
    ) {
        return this.ratingService.createRating(payload, req['user'])
    }

    @ApiOperation({ summary: 'Update rating' })
    @UseGuards(AuthGuard)
    @Put('update/:id')
    updateRating(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: RatingDto,
        @Req() req: Request
    ) {
        return this.ratingService.updateRating(id, payload, req['user'])
    }

    @ApiOperation({ summary: 'Delete rating' })
    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    deleteRating(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.ratingService.deleteRating(id, req['user'])
    }
}