import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Status, UserRole } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { MentorProfileDto } from './dto/mentor-profile.dto';

@Injectable()
export class MentorProfileService {
    constructor(private prisma: PrismaService){}
    
    async getAllMentors(currentUser:{id:number, role: UserRole}){
        const havePermission = ["SUPERADMIN", "ADMIN"]
        if(!havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }


        const mentors = await this.prisma.mentorProfile.findMany({
            where:{
                users:{
                    status:Status.active
                }
            },
            select:{
                id: true,
                users:{
                    select:{
                        id: true,
                        fullName: true,
                        phone: true,
                        image: true
                    }
                },
                about: true,
                job : true,
                experience : true,
                email: true,
                telegram : true,
                instagram : true,
                linkedin : true,
                facebook : true,
                github : true,
                website : true,
                createdAt: true
            }
        })

        return{
            success: true,
            data: mentors
        }
    }

    async createProfile(payload: MentorProfileDto, currentUser:{id: number, role: UserRole}){
        const existMentor = await this.prisma.mentorProfile.findFirst({
            where:{user_id:payload.user_id}
        })

        if(existMentor){
           throw new ConflictException("Mentor has already profile") 
        }

        const havePermission = ["SUPERADMIN", "ADMIN", "MENTOR"]
        if(currentUser.id!=payload.user_id && !havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }
        
        await this.prisma.mentorProfile.create({
            data:payload
        })

        return {
            success: true,
            message: "Mentor profile is created successfully"
        }
    }

    async updateProfile(id: number, payload, currentUser:{id: number, role: UserRole}){
        const existMentor =  await this.prisma.mentorProfile.findFirst({
            where:{id}
        })

        if(!existMentor){
            throw new NotFoundException("Mentor is not found by this ID")
        }

        const havePermission = ["SUPERADMIN", "ADMIN", "MENTOR"]
        if(currentUser.id!=payload.user_id && !havePermission.includes(currentUser.role)){
            throw new ForbiddenException("You have no access to this action")
        }

        await this.prisma.mentorProfile.update({
            where:{id},
            data:{
                about: payload.about ?? existMentor.about,
                job : payload.job ?? existMentor.job,
                experience : payload.experience ?? existMentor.experience,
                email: payload.email ?? existMentor.email,
                telegram : payload.telegram ?? existMentor.telegram,
                instagram : payload.instagram ?? existMentor.instagram,
                linkedin : payload.linkedin ?? existMentor.linkedin,
                facebook : payload.facebook ?? existMentor.facebook,
                github : payload.github ?? existMentor.github,
                website : payload.website ?? existMentor.website,
            }
        })

        return {
            success: true,
            message:"Profile is updated"
        }
    }

    async deleteProfile(id: number, currentUser:{id: number, role: UserRole}){
        const existMentor =  await this.prisma.mentorProfile.findFirst({
            where:{id}
        })

        if(!existMentor){
            throw new NotFoundException("Mentor is not found by this ID")
        }


        if(currentUser.id!=id && currentUser.role!=UserRole.SUPERADMIN){
            throw new ForbiddenException("You have no access to this action")
        }

        await this.prisma.user.update({
            where:{id:existMentor.user_id},
            data:{
                status:Status.inactive
            }
        })

        return {
            success: true,
            message: "Mentor fired!"
        }
    }
}
