import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService : JwtService
    ){}

    async login(payload: LoginDto){
        const existUser = await this.prisma.user.findFirst({
            where: {phone: payload.phone}
        })

        if(!existUser){
            throw new NotFoundException("Phone or password is wrong")
        }

        if(await bcrypt.compare(payload.password, existUser.password)){
            throw new BadRequestException("Phone or password is wrong")
        }

        return {
            success: true,
            message: "You are logged in",
            token: this.jwtService.sign({id:existUser, phone: existUser.phone, role: existUser.role})
        }
    }
}
