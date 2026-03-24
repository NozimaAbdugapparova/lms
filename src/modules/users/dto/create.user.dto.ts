import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"
import { Transform } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator"

export class registerUserDto {
    @ApiProperty()
    @IsString()
    fullName : string

    @ApiProperty()
    @IsPhoneNumber('UZ')
    phone : string

    @ApiProperty()
    @IsString()
    password : string
}

export class UpdateRoleDto {
    @ApiProperty()
    @IsNumber()
    id: number

    @ApiProperty()
    @IsEnum(UserRole)
    role : UserRole
}

export class UpdateProfileDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    fullName : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber('UZ')
    @Transform(({ value }) => value === "" ? undefined : value)
    phone : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    password : string
}
