import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LessonViewService } from './lesson-view.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LessonViewDto } from './dto/lesson-view.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';


@ApiBearerAuth()
@Controller('lesson-view')
export class LessonViewController {
    constructor(private lessonViewService: LessonViewService){}

    @ApiOperation({
        summary: `It is for getting all lesson views, SUPERADMIN, ADMIN, MENTOR`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MENTOR)
    @Get("all")
    getAllLessonViews(){
        return this.lessonViewService.getAllLessonViews()
    }

    @ApiOperation({
        summary: `It is for creating lesson view`
    })
    @UseGuards(AuthGuard)
    @Post('create')
    createLessonView(
        @Body() payload : LessonViewDto,
        @Req() req: Request
    ){
        return this.lessonViewService.createLessonView(payload, req["user"])
    }
}
