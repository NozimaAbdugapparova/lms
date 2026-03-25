import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UnsupportedMediaTypeException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CourseLevel, UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { abort } from 'process';

@ApiBearerAuth()
@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService){}

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}`
    })
    @UseGuards(AuthGuard)
    @Get("all")
    getAllCourses(){
        return this.courseService.getAllCourses()
    }

    @ApiOperation({
        summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                categoryId: { type: "number" },
                mentorId: { type: "number" },
                name: { type: "string" },
                about: { type: "string" },
                price: { type: "number" },
                banner: { type: 'string', format: 'binary' },
                introVideo: { type: 'string', format: 'binary' },
                level: { type: "string", enum: Object.values(CourseLevel) }
            }
        }
    })
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'banner', maxCount: 1 },
            { name: 'introVideo', maxCount: 1 }
        ],
        {
            fileFilter: (req, file, cb) => {
                if (file.fieldname === 'banner') {
                    const allowedImageTypes = ["png", "jpg", "jpeg", "svg"]
                    if (!allowedImageTypes.includes(file.mimetype.split("/")[1])) {
                        return cb(new UnsupportedMediaTypeException("Only png, jpg, jpeg allowed for banner"), false)
                    }
                }

                if (file.fieldname === 'introVideo') {
                    const allowedVideoTypes = ["mp4", "mkv", "webm"]
                    if (!allowedVideoTypes.includes(file.mimetype.split("/")[1])) {
                        return cb(new UnsupportedMediaTypeException("Only mp4, mkv, webm allowed for introVideo"), false)
                    }
                }

                cb(null, true)
            }
        }
    ))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Post("create")
    createCourse(
        @Body() payload: CreateCourseDto,
        @Req() req: Request,
        @UploadedFiles() files: { banner: Express.Multer.File[], introVideo: Express.Multer.File[] }
    ) {
        const banner = files?.banner?.[0]
        const introVideo = files?.introVideo?.[0]
        return this.courseService.createCourse(payload, req["user"], banner, introVideo)
    }

    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                categoryId: { type: "number" },
                mentorId: { type: "number" },
                name: { type: "string" },
                about: { type: "string" },
                price: { type: "number" },
                banner: { type: 'string', format: 'binary' },
                introVideo: { type: 'string', format: 'binary' },
                level: { type: "string", enum: Object.values(CourseLevel) }
            }
        }
    })
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'banner', maxCount: 1 },
            { name: 'introVideo', maxCount: 1 }
        ],
        {
            fileFilter: (req, file, cb) => {
                if (file.fieldname === 'banner') {
                    const allowedImageTypes = ["png", "jpg", "jpeg", "svg"]
                    if (!allowedImageTypes.includes(file.mimetype.split("/")[1])) {
                        return cb(new UnsupportedMediaTypeException("Only png, jpg, jpeg allowed for banner"), false)
                    }
                }

                if (file.fieldname === 'introVideo') {
                    const allowedVideoTypes = ["mp4", "mkv", "webm"]
                    if (!allowedVideoTypes.includes(file.mimetype.split("/")[1])) {
                        return cb(new UnsupportedMediaTypeException("Only mp4, mkv, webm allowed for introVideo"), false)
                    }
                }

                cb(null, true)
            }
        }
    ))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Put("update/:id")
    updateCourse(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload : UpdateCourseDto,
        @Req() req: Request,
        @UploadedFiles() files?: { banner: Express.Multer.File[], introVideo: Express.Multer.File[] }
    ){
        const banner = files?.banner?.[0]
        const introVideo = files?.introVideo?.[0]
        return this.courseService.updateCourse(id, payload, req["user"], banner, introVideo)
    }


    @ApiOperation({
        summary:`${UserRole.SUPERADMIN}, ${UserRole.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Delete("delete/:id")
    deleteCourse(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ){
        return this.courseService.deleteCourse(id, req["user"])
    }
}
