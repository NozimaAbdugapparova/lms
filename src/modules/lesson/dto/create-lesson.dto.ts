import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateLessonDto {
    @ApiProperty()
    @IsString()
    name : string

    @ApiProperty()
    @IsString()
    about : string

    // @ApiProperty()
    // @IsString()
    // video : string

    @ApiProperty()
    @IsNumber()
    sectionId : number
}