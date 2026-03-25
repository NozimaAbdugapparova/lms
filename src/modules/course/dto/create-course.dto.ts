import { ApiProperty } from "@nestjs/swagger"
import { CourseLevel } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsString } from "class-validator"

export class CreateCourseDto {
    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    categoryId : number

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    mentorId : number

    @ApiProperty()
    @IsString()
    name : string

    @ApiProperty()
    @IsString()
    about  : string

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    price  : number

    // @ApiProperty()
    // @IsString()
    // banner : string

    // @ApiProperty()
    // @IsString()
    // introVideo : string

    @ApiProperty()
    @IsEnum(CourseLevel)
    level : CourseLevel
}