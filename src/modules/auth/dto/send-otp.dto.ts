import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber } from "class-validator";

export class SendOtpDto {
    @ApiProperty()
    @IsPhoneNumber("UZ")
    phone: string
}