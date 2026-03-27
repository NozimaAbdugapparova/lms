import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { UserRole } from '@prisma/client';
import { resetPasswordDto } from './dto/reset-password.dto';
import { RedisService } from 'src/core/redis/redis.service';
import { smsService } from 'src/core/services/sms.service';
import { generateOtp } from 'src/core/utils/generate';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify.otp.dto';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService : JwtService,
        private redisService : RedisService,
        private smsService: smsService
    ){}


    private getMessage(otp: string) {
        return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
    }

    async login(payload: LoginDto){
        const existUser = await this.prisma.user.findFirst({
            where: {phone: payload.phone}
        })

        if(!existUser){
            throw new NotFoundException("Phone or password is wrong")
        }

        if(!await bcrypt.compare(payload.password, existUser.password)){
            throw new BadRequestException("Phone or password is wrong")
        }

        return {
            success: true,
            message: "You are logged in",
            token: this.jwtService.sign({id:existUser.id, phone: existUser.phone, role: existUser.role})
        }
    }

    async resetPassword(passwordNew: resetPasswordDto, currentUser:{id: number, role: UserRole}){
        const hashPass = await bcrypt.hash(passwordNew.password, 10)
        await this.prisma.user.update({
            where:{id:currentUser.id},
            data:{
                password: hashPass
            }
        })

        return {
            success: true,
            message: "Your password is updated"
        }
    }

    async recoverPassword(payload: SendOtpDto){
        const { phone } = payload
        const key = 'reg_' + phone
        const session = await this.redisService.get(key)

        if(session){
            throw new HttpException(
                'Code already sent to user',
                HttpStatus.BAD_REQUEST,
            );
        }
        
        const otp = generateOtp();
        await this.redisService.set(key, String(otp))
        await this.smsService.sendSms(this.getMessage(String(otp)), phone)
        return { message: "Confirmation code is sent"}
    }

    async verifyOtp({phone, otp}: VerifyOtpDto) {
        const key = 'reg_' + phone
        const session = await this.redisService.get(key)

        if (!session) {
            throw new BadRequestException('OTP expired or not found')
        }

        if (String(session) !== String(otp)) {
            throw new BadRequestException('Invalid OTP')
        }

        await this.redisService.del(key)

        // Find user and return a short-lived recovery token
        const user = await this.prisma.user.findFirst({ where: { phone } })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const recoveryToken = this.jwtService.sign(
            { id: user.id, role: user.role },
            { expiresIn: '5m' }  // token only valid for 5 minutes
        )

        return {
            success: true,
            message: 'You are logged in change your password',
            recoveryToken
        }
    }

}
