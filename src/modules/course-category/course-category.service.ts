import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { CourseCategoryDto } from './dto/course-category.dto';

@Injectable()
export class CourseCategoryService {
    constructor(private prisma: PrismaService){}

    async getAllCategories(){
        const categories = await this.prisma.courseCategory.findMany()

        return {
            success: true,
            data: categories
        }
    }

    async createCourseCategory(payload: CourseCategoryDto, currentUser: {id: number, role: UserRole}){
        const existCategory = await this.prisma.courseCategory.findFirst({
            where:{name:payload.name}
        })

        if(existCategory){
            throw new ConflictException("Category is already exist")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        await this.prisma.courseCategory.create({
            data:payload
        })

        return{
            success: true,
            message: "Course category is created successfully"
        }

    }

    async updateCourseCategory(id: number, payload: CourseCategoryDto, currentUser: {id: number, role: UserRole}){
        const existCategory = await this.prisma.courseCategory.findFirst({
            where:{id}
        })

        if(!existCategory){
            throw new ConflictException("Category is not found by this ID")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        await this.prisma.courseCategory.update({
            where:{id},
            data:payload
        })

        return{
            success: true,
            message: "Course category is updated successfully"
        }

    }

    async deleteCourseCategory(id: number, currentUser: {id: number, role: UserRole}){
        const existCategory = await this.prisma.courseCategory.findFirst({
            where:{id}
        })

        if(!existCategory){
            throw new ConflictException("Category is not found by this ID")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        await this.prisma.courseCategory.delete({
            where:{id}
        })

        return{
            success: true,
            message: "Course category is deleted successfully"
        }

    }
}
