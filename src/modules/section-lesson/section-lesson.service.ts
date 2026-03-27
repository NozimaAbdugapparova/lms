import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { SectionLessonDto } from './dto/section-lesson.dto';
import { UpdateSectionDto } from './dto/update.section.dto';

@Injectable()
export class SectionLessonService {
    constructor(private prisma: PrismaService){}

    async getAllSections(){
        const sections = await this.prisma.sectionLesson.findMany()

        return {
            success: true,
            data: sections
        }
    }

    async createSectionLesson(payload: SectionLessonDto){
        const existSection = await this.prisma.sectionLesson.findFirst({
            where:{
                course_id: payload.course_id,
                name: payload.name
            }
        })

        if(existSection){
            throw new ConflictException("Section is already exist")
        }

        await this.prisma.sectionLesson.create({
            data:payload
        })

        return {
            success: true,
            message:"Section is created"
        }
    }

    async updateSection(id: number, payload: UpdateSectionDto){
        const existSection = await this.prisma.sectionLesson.findFirst({
            where:{id}
        })

        if(!existSection){
            throw new ConflictException("Section is not exist")
        }

        await this.prisma.sectionLesson.update({
            where:{id}, 
            data:{
                name: payload.name
            }
        })

        return {
            success: true,
            message:"Section name is updated"
        }
    }

    async deleteSection(id: number){
        const existSection = await this.prisma.sectionLesson.findFirst({
            where:{id}
        })

        if(!existSection){
            throw new ConflictException("Section is not exist")
        }

        await this.prisma.sectionLesson.delete({
            where:{id}
        })

        return {
            success: true,
            message:"Section is deleted"
        }
    }
}
