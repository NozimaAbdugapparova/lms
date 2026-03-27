import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { RatingDto } from './dto/rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
    constructor(private prisma: PrismaService) {}

    async getAllRating() {
        const rating = await this.prisma.rating.findMany()

        return {
            success: true,
            data: rating
        }
    }

    async getByCourse(courseId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId }
        })
        if (!course) {
            throw new NotFoundException("Course not found")
        }

        const courseRating = await this.prisma.rating.findMany({
            where: { course_id: courseId }
        })

        const total = courseRating.reduce((acc, el) => acc + el.rate, 0)

        return {
            success: true,
            totalRating: total,
            data: courseRating
        }

    }

    async getMyRatings(currentUser: { id: number, role: UserRole }) {
        const myRatings = await this.prisma.rating.findMany({
            where: { user_id: currentUser.id }
        })

        return {
            success: true,
            data: myRatings
        }
    }

    async createRating(payload: RatingDto, currentUser: { id: number, role: UserRole }) {
        
        const course = await this.prisma.course.findFirst({
            where: { id: payload.course_id }
        })
        if (!course) {
            throw new NotFoundException("Course not found")
        }

        const alreadyRated = await this.prisma.rating.findFirst({
            where: {
                user_id: payload.user_id,
                course_id: payload.course_id
            }
        })
        if (alreadyRated) {
            throw new BadRequestException("You have already rated this course")
        }

        if(payload.user_id!=currentUser.id){
            throw new ForbiddenException("You don't have access to this action")
        }

        await this.prisma.rating.create({
            data: {
                user_id: payload.user_id, 
                course_id: payload.course_id,
                comment: payload.comment,
                rate: payload.rate
            }
        })

        return {
            success: true,
            message: "Rating created successfully"
        }
    }

    async updateRating(id: number, payload: UpdateRatingDto, currentUser: { id: number, role: UserRole }) {
        const rating = await this.prisma.rating.findUnique({
            where: { id }
        })
        if (!rating) {
            throw new NotFoundException("Rating not found")
        }

        if (rating.user_id !== currentUser.id) {
            throw new ForbiddenException("You can only update your own rating")
        }

        await this.prisma.rating.update({
            where: { id },
            data: {
                comment: payload.comment || rating.comment,
                rate: payload.rate || rating.rate
            }
        })

        return {
            success: true,
            message: "Rating updated successfully"
        }
    }

    async deleteRating(id: number, currentUser: { id: number, role: UserRole }) {
        const rating = await this.prisma.rating.findUnique({
            where: { id }
        })
        if (!rating) {
            throw new NotFoundException("Rating not found")
        }

        const canDelete = ["SUPERADMIN", "ADMIN"]
        if (rating.user_id != currentUser.id && !canDelete.includes(currentUser.role)) {
            throw new ForbiddenException("You have no access to delete this rating")
        }

        await this.prisma.rating.delete({
            where: { id }
        })

        return {
            success: true,
            message: "Rating deleted successfully"
        }
    }
}