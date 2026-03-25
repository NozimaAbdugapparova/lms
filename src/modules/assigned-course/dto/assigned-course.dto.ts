import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class AssignedCourseDto{
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsNumber()
    course_id : number
}