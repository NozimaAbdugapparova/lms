import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { smsService } from 'src/core/services/sms.service';

@Module({
    imports:[
        JwtModule.register({
            global: true,
            secret:"lms",
            signOptions:{
                expiresIn: "2h"
            }
        })
    ],
  controllers: [AuthController],
  providers: [AuthService, smsService]
})
export class AuthModule {}
