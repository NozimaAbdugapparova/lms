import { ApiProperty } from "@nestjs/swagger"
import { PaidVia } from "@prisma/client"
import { IsEnum, IsNumber } from "class-validator"

export class PurchasedCourseDto{
    @ApiProperty()
    @IsNumber()
    user_id  : number

    @ApiProperty()
    @IsNumber()
    course_id : number

    @ApiProperty()
    @IsNumber()
    amount : number

    @ApiProperty()
    @IsEnum(PaidVia)
    paidVia : PaidVia
}