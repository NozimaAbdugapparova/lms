import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class SectionLessonDto {
    @ApiProperty()
    @IsNumber()
    course_id : number

    @ApiProperty()
    @IsString()
    name : string
}