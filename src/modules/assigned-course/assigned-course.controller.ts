import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AssignedCourseService } from './assigned-course.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AssignedCourseDto } from './dto/assigned-course.dto';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';

@ApiBearerAuth()
@Controller('assigned-course')
export class AssignedCourseController {
    constructor(private assignedCourseService: AssignedCourseService){}

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Get('all')
    getAllAssignedCourses(
        @Req() req: Request
    ){
        return this.assignedCourseService.getAllAssignedCourses(req["user"])
    }

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @UseGuards(AuthGuard)
    @Post('create')
    createAssignedCourse(
        @Body() payload: AssignedCourseDto,
        @Req() req: Request
    ){
     return this.assignedCourseService.createAssignedCourse(payload, req['user'])   
    }

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @UseGuards(AuthGuard)
    @Delete("delete/:id")
    deleteAssignedCourse(
        @Param('id',ParseIntPipe) id: number,
        @Req() req: Request
    ){
        return this.assignedCourseService.deleteAssignedCourse(id, req["user"])
    }


}
