import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { CourseLevel } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateCourseDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    categoryId : number

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    mentorId : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    about  : string

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    price  : number

    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsString()
    // banner : string

    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsString()
    // introVideo : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(CourseLevel)
    level : CourseLevel
}