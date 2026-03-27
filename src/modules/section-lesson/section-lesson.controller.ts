import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { SectionLessonService } from './section-lesson.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SectionLessonDto } from './dto/section-lesson.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';
import { UpdateSectionDto } from './dto/update.section.dto';


@ApiBearerAuth()
@Controller('section-lesson')
export class SectionLessonController {
    constructor(private readonly sectionLessonService: SectionLessonService){}

    @ApiOperation({
        summary:`Everyone can see all sections`
    })
    @UseGuards(AuthGuard)
    @Get('all')
    getAllSections(){
        return this.sectionLessonService.getAllSections()
    }


    @ApiOperation({
        summary:`Creating lesson sections, SUPERADMIN, ADMIN, MENTOR`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MENTOR)
    @Post('create')
    createSectionLesson(
        @Body() payload: SectionLessonDto
    ){
        return this.sectionLessonService.createSectionLesson(payload)
    }

    @ApiOperation({
        summary:`Updating lesson sections, SUPERADMIN, ADMIN, MENTOR`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MENTOR)
    @Put("update/:id")
    updateSection(
        @Param('id', ParseIntPipe) id:number,
        @Body() payload: UpdateSectionDto
    ){
        return this.sectionLessonService.updateSection(id, payload)
    }

    @ApiOperation({
        summary:`Deleting lesson sections, SUPERADMIN, ADMIN, MENTOR`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MENTOR)
    @Put("delete/:id")
    deleteSection(
        @Param('id', ParseIntPipe) id:number
    ){
        return this.sectionLessonService.deleteSection(id)
    }
}
