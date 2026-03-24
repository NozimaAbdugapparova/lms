import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class MentorProfileDto {
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsString()
    about : string

    @ApiProperty()
    @IsString()
    job : string

    @ApiProperty()
    @IsNumber()
    experience : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    telegram : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    instagram : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    linkedin : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    facebook : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    github : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    website : string
}