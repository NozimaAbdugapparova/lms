import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/core/database/prisma.service'
import { CloudinaryService } from 'nestjs-cloudinary'
import { LessonFileDto } from './dto/lesson-file.dto'

@Injectable()
export class LessonFileService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService
    ) {}

    async getAll() {
        const files = await this.prisma.lessonFile.findMany()
        return { success: true, data: files }
    }

    async getByLesson(lessonId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId }
        })
        if (!lesson) throw new NotFoundException('Lesson not found')

        const files = await this.prisma.lessonFile.findMany({
            where: { lessonId }
        })
        return { success: true, data: files }
    }

    async create(payload: LessonFileDto, file: Express.Multer.File) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: payload.lessonId }
        })
        if (!lesson) throw new NotFoundException('Lesson not found')

        const uploaded = await this.cloudinaryService.uploadFile(file, {
            resource_type: 'auto'
        })

        await this.prisma.lessonFile.create({
            data: {
                lessonId: payload.lessonId,
                note: payload.note,
                file: uploaded.secure_url
            }
        })

        return { success: true, message: 'File uploaded successfully' }
    }

    async update(id: number, payload: Partial<LessonFileDto>, file?: Express.Multer.File) {
        const existFile = await this.prisma.lessonFile.findUnique({
            where: { id }
        })
        if (!existFile) throw new NotFoundException('File not found')

        let fileUrl = existFile.file
        if (file) {
            const uploaded = await this.cloudinaryService.uploadFile(file, {
                resource_type: 'auto'
            })
            fileUrl = uploaded.secure_url
        }

        await this.prisma.lessonFile.update({
            where: { id },
            data: {
                note: payload.note || existFile.note,
                file: fileUrl
            }
        })

        return { success: true, message: 'File updated successfully' }
    }

    async delete(id: number) {
        const existFile = await this.prisma.lessonFile.findUnique({
            where: { id }
        })
        if (!existFile) throw new NotFoundException('File not found')

        await this.prisma.lessonFile.delete({ where: { id } })

        return { success: true, message: 'File deleted successfully' }
    }
}