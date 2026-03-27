import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UserRole } from '@prisma/client';
import { CloudinaryService } from 'nestjs-cloudinary';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService

    ){}

    async getAllLessons(){
        const lessons = await this.prisma.lesson.findMany()

        return {
            success:true,
            data: lessons
        }
    }

    async createLesson(payload: CreateLessonDto,video: Express.Multer.File){
        const existSection = await this.prisma.sectionLesson.findFirst({
            where:{id:payload.sectionId}
        })
    
        if(!existSection){
            throw new NotFoundException("Section is not found by this ID")
        }
    
        const existLesson = await this.prisma.lesson.findFirst({
            where:{
                name:payload.name,
                sectionId:payload.sectionId
            }
        })
    
        if(existLesson){
            throw new ConflictException("Lesson is already exist")
        }
    
        const videoUpload = await this.cloudinaryService.uploadFile(video)
    
        const videoUrl = videoUpload.secure_url
    
        await this.prisma.lesson.create({
            data:{
                ...payload,
                video:videoUrl
            }
        })
    
        return {
            success: true,
            message:"Lesson uploaded successfully"
        }
    }

    async updateLesson(id: number, payload: UpdateLessonDto, video?: Express.Multer.File){
        const existSection = await this.prisma.sectionLesson.findFirst({
            where:{id}
        })

        if(!existSection){
            throw new NotFoundException("Section is not found by this ID")
        }

        const existLesson = await this.prisma.lesson.findFirst({
            where:{id}
        })
    
        if(!existLesson){
            throw new ConflictException("Lesson does not exist exist")
        }
    }
}
