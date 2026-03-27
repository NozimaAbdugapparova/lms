import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { resetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify.otp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    login(
        @Body() payload : LoginDto
    ){
        return this.authService.login(payload)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post("resetPassword")
    resetPassword(
        @Body() password: resetPasswordDto,
        @Req() req: Request
    ){
        return this.authService.resetPassword(password, req['user']);
    }

    @Post("recover/password")
    passwordRecover(
        @Body() payload : SendOtpDto
    ){
        return this.authService.recoverPassword(payload)
    }

    @Post("otp")
    loginOtp(
        @Body() payload : VerifyOtpDto
    ){
        return this.authService.verifyOtp(payload)
    }
}
