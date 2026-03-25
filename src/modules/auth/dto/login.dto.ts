import { ApiProperty } from "@nestjs/swagger"
import { IsPhoneNumber, IsString } from "class-validator"

export class LoginDto{
    @ApiProperty({example:"+998944458106"})
    @IsPhoneNumber("UZ")
    phone: string

    @ApiProperty({example:"12345"})
    @IsString()
    password: string
}