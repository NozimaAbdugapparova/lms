import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { LessonViewDto } from './dto/lesson-view.dto';

@Injectable()
export class LessonViewService {
    constructor(private prisma : PrismaService){}

    async getAllLessonViews(){
        const views = await this.prisma.lessonView.findMany()

        return {
            success: true,
            data: views
        }
    }

    async createLessonView(payload: LessonViewDto, currentUser:{id:number, role: UserRole}){
        const existView = await this.prisma.lessonView.findFirst({
            where:{
                user_id: payload.user_id,
                lesson_id: payload.lesson_id
            }
        })

        if(existView){
            throw new ConflictException("Lesson is viewed already")
        }

        await this.prisma.lessonView.create({
            data:{
                ...payload,
                view: true
            }
        })

        return {
            success: true,
            message: "View is recorded"
        }
    }
}
