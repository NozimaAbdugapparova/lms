import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { PurchasedCourseDto } from './dto/purchased-course.dto';

@Injectable()
export class PurchasedCourseService {
    constructor(private prisma: PrismaService){}

    async getAllPurchasedCourses() {
        const purchasedCourses = await this.prisma.purchasedCourse.findMany()

        return{
            success: true,
            data: purchasedCourses
        }
    }

    async getMyCourses(currentUser: { id: number, role: UserRole }) {
        return this.prisma.purchasedCourse.findMany({
            where: { user_id: currentUser.id },
            include: { course: true }
        })
    }

    async purchaseCourse(payload: PurchasedCourseDto, currentUser: { id: number, role: UserRole }) {
    
        const course = await this.prisma.course.findUnique({
            where: { id: payload.course_id }
        })
        if (!course) {
            throw new NotFoundException("Course not found")
        }

        
        const alreadyPurchased = await this.prisma.purchasedCourse.findFirst({
            where: {
                user_id: payload.user_id,
                course_id: payload.course_id
            }
        })
        if (alreadyPurchased) {
            throw new BadRequestException("You have already purchased this course")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(payload.user_id!=currentUser.id && !havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You dont have permission to this action")
        }

        if(payload.amount<Number(course.price)){
            throw new BadRequestException("Payment amount is not enough")
        }

        await this.prisma.user.update({
            where:{id:payload.user_id},
            data:{
                role:UserRole.STUDENT
            }
        })

        await this.prisma.purchasedCourse.create({
            data: {
                user_id: payload.user_id,
                course_id: payload.course_id,
                amount: payload.amount,
                paidVia: payload.paidVia
            }
        })

        return {
            success: true,
            message: "Course purchased successfully"
        }
    }

    async deletePurchase(id: number, currentUser:{id:number, role: UserRole}) {
        const purchase = await this.prisma.purchasedCourse.findUnique({
            where: { id },
            select:{
                user:{
                    select:{
                        id: true
                    }
                }
            }
        })
        if (!purchase) {
            throw new NotFoundException("Purchase record not found")
        }

        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(id!=currentUser.id && !havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You dont have permission to this action")
        }

        await this.prisma.user.update({
            where:{id: purchase.user.id},
            data:{
                role:UserRole.USER
            }
        })

        await this.prisma.purchasedCourse.delete({
            where: { id }
        })

        return {
            success: true,
            message: "Purchase record deleted"
        }
    }
}
