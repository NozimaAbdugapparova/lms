import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { PurchasedCourseService } from './purchased-course.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PurchasedCourseDto } from './dto/purchased-course.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';

@ApiBearerAuth()
@Controller('purchased-course')
export class PurchasedCourseController {
    constructor(private readonly purchasedCourseService: PurchasedCourseService){}

    @ApiOperation({ 
        summary: 'Get all purchased courses - SUPERADMIN, ADMIN' 
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Get('all')
    getAll() {
        return this.purchasedCourseService.getAllPurchasedCourses()
    }

    @ApiOperation({ 
        summary: 'Get my purchased courses' 
    })
    @UseGuards(AuthGuard)
    @Get('my')
    getMyCourses(@Req() req: Request) {
        return this.purchasedCourseService.getMyCourses(req['user'])
    }

    @ApiOperation({ 
        summary: 'Purchase a course' 
    })
    @UseGuards(AuthGuard)
    @Post('create')
    purchaseCourse(
        @Body() payload: PurchasedCourseDto,
        @Req() req: Request
    ) {
        return this.purchasedCourseService.purchaseCourse(payload, req['user'])
    }

    @ApiOperation({ 
        summary: 'Delete purchased course - SUPERADMIN, ADMIN' 
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Delete('delete/:id')
    deletePurchase(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.purchasedCourseService.deletePurchase(id, req['user'])
    }
}
