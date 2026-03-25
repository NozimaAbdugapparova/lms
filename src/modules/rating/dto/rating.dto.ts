import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class RatingDto{
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsNumber()
    course_id : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    comment : string

    @ApiProperty({minimum:1, maximum:5})
    @IsNumber()
    @Min(1)
    @Max(5)
    rate : number
}
