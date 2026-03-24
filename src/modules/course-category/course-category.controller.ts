import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CourseCategoryDto } from './dto/course-category.dto';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';

@ApiBearerAuth()
@Controller('course-category')
export class CourseCategoryController {
    constructor(private readonly courseCategoryService: CourseCategoryService){}

    @ApiOperation({
        summary:`Everyone can see all categories`
    })
    @UseGuards(AuthGuard)
    @Get('all')
    getAllCategories(){
        return this.courseCategoryService.getAllCategories()
    }

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Post('create')
    createCourseCategory(
        @Body() payload: CourseCategoryDto,
        @Req() req: Request
    ){
        return this.courseCategoryService.createCourseCategory(payload, req["user"])
    }

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Put('update/:id')
    updateCourseCategory(
        @Param("id", ParseIntPipe) id: number, 
        @Body() payload: CourseCategoryDto,
        @Req() req: Request
    ){
        return this.courseCategoryService.updateCourseCategory(id, payload, req["user"])
    }

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Delete('delete/:id')
    deleteCourseCategory(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ){
        return this.courseCategoryService.deleteCourseCategory(id, req["user"])
    }
}
