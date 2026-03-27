import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsString } from "class-validator"

export class LessonFileDto {
    // @ApiProperty()
    // @IsString()
    // file : string

    @ApiProperty()
    @IsString()
    note : string

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    lessonId : number
}