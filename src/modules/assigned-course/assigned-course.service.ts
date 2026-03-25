import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { AssignedCourseDto } from './dto/assigned-course.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AssignedCourseService {
    constructor(private prisma: PrismaService){}

    async getAllAssignedCourses(currentUser:{role:UserRole}){
        const assignedCourses = await this.prisma.assignedCourse.findMany()

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        return{
            success: true,
            data: assignedCourses
        }
    }

    async createAssignedCourse(payload : AssignedCourseDto, currentUser: {id: number, role: UserRole}){
        const existAssignedCourse = await this.prisma.assignedCourse.findFirst({
            where:{
                user_id: payload.user_id,
                course_id: payload.course_id
            }
        })

        if(existAssignedCourse){
            throw new ConflictException("User is already signed up to this course")
        }

        const courseName = await this.prisma.course.findFirst({
            where:{id:payload.course_id}
        })

        if(!courseName){
            throw new NotFoundException("Course is not found by this ID")
        }

        const existUser = await this.prisma.user.findUnique({
            where:{id:payload.user_id}
        })

        if(!existUser){
            throw new NotFoundException("User is not found by this ID")
        }

        const canAssign = ["USER", "STUDENT"]

        if(!canAssign.includes(existUser.role)){
            throw new ForbiddenException("You can not sign up to this course")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(payload.user_id!=currentUser.id && !havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }


        await this.prisma.assignedCourse.create({
            data:payload
        })
        

        return{
            success: true,
            message: `User is signed up to ${courseName.name} course`
        }
    }

    async deleteAssignedCourse(id: number, currentUser:{id:number, role: UserRole}){
        const existAssignedCourse = await this.prisma.assignedCourse.findFirst({
            where:{id}
        })

        if(existAssignedCourse){
            throw new ConflictException("User is already signed up to this course")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(id!=currentUser.id && !havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        await this.prisma.assignedCourse.delete({
            where:{id}
        })

        return{
            success: true,
            message:"Assigned course is deleted successfully"
        }

    }
}