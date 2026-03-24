import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { registerUserDto, UpdateProfileDto, UpdateRoleDto } from './dto/create.user.dto';
import * as bcrypt from "bcrypt";
import { Status, UserRole } from '@prisma/client';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class UsersService {
    constructor(
        private prisma : PrismaService,
        private cloudinaryService: CloudinaryService
    ){}

    async getAllUsers(req: Request){
        const users = await this.prisma.user.findMany({
            where:{status:Status.active},
            select:{
                id: true,
                fullName: true,
                phone: true,
                role: true,
                image: true,
                createdAt: true
            }
        })

        return{
            success: true,
            data: users
        }
    }

    async registerUser(payload : registerUserDto, file? : Express.Multer.File){
        const existUser = await this.prisma.user.findFirst({
            where:{phone: payload.phone}
        })

        if(existUser){
            throw new ConflictException("You are already registered. Go to login page to enter your account")
        }
        let url: string | null =null
        if(file){
            const uploadResult = await this.cloudinaryService.uploadFile(file);
            url = uploadResult.url
        }
        const hashPass = await bcrypt.hash(payload.password, 10)

        await this.prisma.user.create({
            data: {
                fullName: payload.fullName,
                phone: payload.phone,
                password: hashPass,
                image:url
            }
        })

        return {
            success: true,
            message: "You are registered successfully"
        }
    }

    async updateRole(payload: UpdateRoleDto){
        const existUser = await this.prisma.user.findUnique({
            where:{id: payload.id}
        })

        if(!existUser){
            throw new NotFoundException("User does not exist")
        }

        await this.prisma.user.update({
            where:{id: payload.id},
            data:{
                role:payload.role
            }
        })

        return {
            success: true,
            message: "User's role is updated"
        }
    }

    async updateProfile(id:number, payload: UpdateProfileDto, currentUser: {id: number, role: UserRole}, file?:Express.Multer.File){
        
        const existUser = await this.prisma.user.findUnique({
            where:{id}
        })

        if(!existUser){
            throw new NotFoundException("User does not exist")
        }
        const permission = ["ADMIN", "SUPERADMIN"]
        if(id!=currentUser.id && !permission.includes(currentUser.role)){
            throw new ForbiddenException("You can not edit other's profile")
        }

        let url: string | null =null
        if(file){
            const uploadResult = await this.cloudinaryService.uploadFile(file);
            url = uploadResult.url
        }
        await this.prisma.user.update({
            where:{id},
            data:{
                fullName:payload.fullName ?? existUser.fullName,
                phone:payload.phone?? existUser.phone,
                password:payload.password ?? existUser.password,
                image: url?? null
            }
        })

        return{
            success: true,
            message:"Your profile is updated successfully"
        }
    }

    async deleteUser(id:number, currentUser:{id:number, role: UserRole}){
        const existUser = await this.prisma.user.findUnique({
            where:{id}
        })

        if(!existUser){
            throw new NotFoundException("User does not exist")
        }
        const permission = ["ADMIN", "SUPERADMIN"]
        if(id!=currentUser.id && !permission.includes(currentUser.role)){
            throw new ForbiddenException("You can not delete other's profile")
        }

        await this.prisma.user.update({
            where:{id},
            data:{
                status:Status.inactive
            }
        })

        return{
            success: true,
            message: "Your accound is deleted successfully" 
        }
    }
}
