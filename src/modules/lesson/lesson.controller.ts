import { Body, Controller, Param, ParseIntPipe, Post, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Roles } from 'src/common/decorators/role';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiBearerAuth()
@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService : LessonService){}

    @ApiOperation({
        summary: 'Creating lesson, SUPERADMIN, ADMIN, MENTOR'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: { type: "string" },
                about: { type: "string" },
                video: { type: 'string', format: 'binary' },
                sectionId: { type: "number" }
            }
        }
    })
    @UseInterceptors(FileInterceptor('video', {
        fileFilter:(req, file, cb) =>{
            const existFile = ['mp4', 'mkv', 'webm']

            if(!existFile.includes(file.mimetype.split('/')[1])){
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Post('create')
    createLesson(
        @Body() payload : CreateLessonDto,
        @UploadedFile() video: Express.Multer.File
    ){
        return this.lessonService.createLesson(payload,video)
    }

    @ApiOperation({
        summary: 'Updating lesson, SUPERADMIN, ADMIN, MENTOR'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: { type: "string" },
                about: { type: "string" },
                video: { type: 'string', format: 'binary' },
                sectionId: { type: "number" }
            }
        }
    })
    @UseInterceptors(FileInterceptor('video', {
        fileFilter:(req, file, cb) =>{
            const existFile = ['mp4', 'mkv', 'webm']

            if(!existFile.includes(file.mimetype.split('/')[1])){
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Post('update/:id')
    updateLesson(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload : UpdateLessonDto,
        @UploadedFile() video?: Express.Multer.File
    ){
        return this.lessonService.updateLesson(id, payload, video)
    }

}
