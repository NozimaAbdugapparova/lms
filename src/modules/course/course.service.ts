import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Status, UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class CourseService {
    constructor(
        private prisma : PrismaService,
        private cloudinaryService: CloudinaryService
    ){}

    async getAllCourses(){
        const courses = await this.prisma.course.findMany({
            where:{status: Status.active}
        })

        return {
            success: true,
            data:courses
        }
    }

    async createCourse(payload: CreateCourseDto, currentUser:{id:number, role:UserRole}, banner:Express.Multer.File, introVideo: Express.Multer.File){
        const existCategoty = await this.prisma.courseCategory.findFirst({
            where:{id:payload.categoryId}
        })

        if(!existCategoty){
            throw new NotFoundException("Category is not found by this ID")
        }

        const existMentor = await this.prisma.mentorProfile.findFirst({
            where:{
                id:payload.mentorId,
                users:{
                    status:Status.active
                }
            }
        })

        if(!existMentor){
            throw new NotFoundException("Mentor is not found by this ID")
        }

        const existUser = await this.prisma.course.findFirst({
            where:{
                name:payload.name,
                mentorId:payload.mentorId
            }
        })

        if(existUser){
            throw new ConflictException("Course is already exist")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        const bannerUpload = await this.cloudinaryService.uploadFile(banner, {
            folder: "banners",
            resource_type: "image"
        })

        const bannerUrl = bannerUpload.secure_url

        const videoUpload = await this.cloudinaryService.uploadFile(introVideo, {
            folder: "intro-videos",
            resource_type: "video"  
        })

        const videoUrl = videoUpload.secure_url

        await this.prisma.course.create({
            data:{
                ...payload,
                banner:bannerUrl,
                introVideo:videoUrl
            }
        })

        return {
            success: true,
            message:"Course published successfully"
        }
    }

    async updateCourse(id: number, payload : UpdateCourseDto, currentUser:{id:number, role:UserRole}, banner?:Express.Multer.File, introVideo?: Express.Multer.File){
        const existCourse = await this.prisma.course.findFirst({
            where:{id}
        })

        if(!existCourse){
            throw new NotFoundException("Course is not found by this ID")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        let bannerUrl: string | null = null
        if(banner){
            const bannerUpload = await this.cloudinaryService.uploadFile(banner, {
                folder: "banners",
                resource_type: "image"
            })

            bannerUrl = bannerUpload.secure_url
        }
        let introVideoUrl: string | null = null
        if(introVideo){
            const videoUpload = await this.cloudinaryService.uploadFile(introVideo, {
                folder: "intro-videos",
                resource_type: "video"  
            })

            introVideoUrl = videoUpload.secure_url
        }

        //         // Add this right before the prisma.course.update()
        // console.log("existCourse.categoryId:", existCourse.categoryId)
        // console.log("payload.categoryId:", payload.categoryId)
        // console.log("final categoryId being used:", payload.categoryId ?? existCourse.categoryId)


        await this.prisma.course.update({
            where:{id},
            data:{
                categoryId : payload.categoryId || existCourse.categoryId,
                mentorId : payload.mentorId || existCourse.mentorId,
                name : payload.name || existCourse.name,
                about  : payload.about || existCourse.about,
                price  : payload.price || existCourse.price,
                banner : bannerUrl ?? existCourse.banner,
                introVideo : introVideoUrl ?? existCourse.introVideo,
                level : payload.level || existCourse.level
            }
        })

        return {
            success: true,
            message: "Course info is updated"
        }

    }

    async deleteCourse(id: number, currentUser:{id:number, role:UserRole}){
        const existCourse = await this.prisma.course.findFirst({
            where:{id}
        })

        if(!existCourse){
            throw new NotFoundException("Course is not found by this ID")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        await this.prisma.course.update({
            where:{id},
            data:{
                status: Status.inactive
            }
        })

        return {
            success: true,
            message: "Course is deleted successfully"
        }

    }
}
