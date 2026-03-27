import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class VerifyOtpDto{
    @ApiProperty()
    @IsPhoneNumber("UZ")
    phone: string

    @ApiProperty()
    @IsString()
    otp: string
}