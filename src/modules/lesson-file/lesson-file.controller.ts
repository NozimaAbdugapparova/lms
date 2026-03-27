import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors, UnsupportedMediaTypeException } from '@nestjs/common'
import { LessonFileService } from './lesson-file.service'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RoleGuard } from 'src/common/guards/role.guard'
import { Roles } from 'src/common/decorators/role'
import { UserRole } from '@prisma/client'
import { LessonFileDto } from './dto/lesson-file.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiBearerAuth()
@Controller('lesson-file')
export class LessonFileController {
    constructor(private readonly lessonFileService: LessonFileService) {}

    @ApiOperation({ 
        summary: 'Get all lesson files - SUPERADMIN, ADMIN' 
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Get('all')
    getAll() {
        return this.lessonFileService.getAll()
    }

    @ApiOperation({ 
        summary: 'Get files by lesson' 
    })
    @UseGuards(AuthGuard)
    @Get('lesson/:lessonId')
    getByLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.lessonFileService.getByLesson(lessonId)
    }

    @ApiOperation({ 
        summary: 'Upload lesson file - SUPERADMIN, ADMIN, MENTOR, ASSISTANT' 
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                note: { type: 'string' },
                lessonId: { type: 'number' },
                file: { type: 'string', format: 'binary' }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            const allowed = ['pdf', 'doc', 'docx', 'zip', 'png', 'jpg', 'jpeg', 'mp4', 'mkv', 'ppt', 'pptx']
            const ext = file?.originalname?.split('.')?.pop()?.toLowerCase()
            if(!ext || !allowed.includes(ext)){
                return cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
    @Post('create')
    create(
        @Body() payload: LessonFileDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.lessonFileService.create(payload, file)
    }

    @ApiOperation({ 
        summary: 'Update lesson file - SUPERADMIN, ADMIN, MENTOR, ASSISTANT' 
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                note: { type: 'string' },
                file: { type: 'string', format: 'binary' },
                lessonId: {type: "number"}
            }
        }
    })
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            const allowed = ['pdf', 'doc', 'docx', 'zip', 'png', 'jpg', 'jpeg', 'mp4', 'mkv', 'ppt', 'pptx']
            const ext = file?.originalname?.split('.')?.pop()?.toLowerCase()
            if(!ext || !allowed.includes(ext)){
                return cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MENTOR, UserRole.ASSISTANT)
    @Put('update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: Partial<LessonFileDto>,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.lessonFileService.update(id, payload, file)
    }

    @ApiOperation({ 
        summary: 'Delete lesson file - SUPERADMIN, ADMIN' 
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.lessonFileService.delete(id)
    }
}