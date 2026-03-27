import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNumber } from "class-validator"

export class LessonViewDto {
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsNumber()
    lesson_id : number
}